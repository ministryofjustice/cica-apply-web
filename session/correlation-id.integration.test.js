/* eslint-disable global-require */

'use strict';

const request = require('supertest');
// Use the installed OIDC library's dependencies to construct realistic provider responses.
// eslint-disable-next-line import/no-extraneous-dependencies
const {JWK, JWT} = require('jose');
// eslint-disable-next-line import/no-extraneous-dependencies
const {TokenSet} = require('openid-client');

jest.mock('express-openid-connect/lib/client', () => ({get: jest.fn()}));

jest.mock('pino-http', () => {
    const createLogger = jest.requireActual('pino-http');
    const {Writable} = require('stream');
    const entries = [];
    const stream = new Writable({
        write(chunk, encoding, callback) {
            entries.push(JSON.parse(chunk.toString()));
            callback();
        }
    });
    const logger = options => createLogger(options, stream);
    logger.entries = entries;
    return logger;
});

jest.mock('../index/routes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/probe', (req, res) => res.sendStatus(200));
    return router;
});

const OWNER_ID = 'urn:uuid:test-authenticated-owner';
const CLIENT_IP = '192.0.2.10';
let app;
let entries;

function sessionCookie(response) {
    return response.headers['set-cookie']
        .filter(cookie => /^session(?:\.\d+)?=/.test(cookie))
        .map(cookie => cookie.split(';')[0])
        .join('; ');
}

function lastLog() {
    return entries[entries.length - 1];
}

async function signIn() {
    const response = await request(app)
        .get('/account/signed-in')
        .set('x-real-ip', CLIENT_IP);
    expect(response.status).toBe(302);
    return sessionCookie(response);
}

describe('authenticated session correlation in request logs', () => {
    beforeAll(async () => {
        const key = await JWK.generate('EC', 'P-256');
        const idToken = JWT.sign({sub: OWNER_ID}, key, {
            algorithm: 'ES256',
            issuer: process.env.CW_GOVUK_ISSUER_URL,
            audience: process.env.CW_GOVUK_CLIENT_ID,
            expiresIn: '1 hour'
        });

        // Mock only the provider boundary; use the real OIDC callback and encrypted cookies.
        require('express-openid-connect/lib/client').get.mockResolvedValue({
            issuer: {issuer: process.env.CW_GOVUK_ISSUER_URL},
            client: {
                callbackParams: () => ({}),
                callback: async () => new TokenSet({id_token: idToken})
            }
        });
        entries = require('pino-http').entries;
        app = require('../app');
    });

    beforeEach(() => {
        entries.length = 0;
    });

    it('logs a non-secret ID, authenticated owner, client IP and timestamp at sign-in', async () => {
        const cookie = await signIn();
        const log = lastLog();

        expect(log.sessionCorrelationId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(log.ownerId).toBe(OWNER_ID);
        expect(log.req.headers['x-real-ip']).toBe(CLIENT_IP);
        expect(log.time).toEqual(expect.any(Number));
        expect(log.req.headers.cookie).toBeUndefined();
        expect(log.res.headers).toBe('[Redacted]');
        expect(JSON.stringify(log)).not.toContain(cookie);
    });

    it('keeps the ID across requests and rolling cookie updates', async () => {
        const cookie = await signIn();
        const id = lastLog().sessionCorrelationId;
        const response = await request(app)
            .get('/probe')
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(lastLog().sessionCorrelationId).toBe(id);

        await request(app)
            .get('/probe')
            .set('Cookie', sessionCookie(response));
        expect(lastLog().sessionCorrelationId).toBe(id);
    });

    it('gives separate sign-ins for the same owner different IDs', async () => {
        await signIn();
        const firstId = lastLog().sessionCorrelationId;
        await signIn();
        expect(lastLog().sessionCorrelationId).not.toBe(firstId);
        expect(lastLog().ownerId).toBe(OWNER_ID);
    });

    it('correlates a copied cookie from a different client IP and redacts credentials', async () => {
        const cookie = await signIn();
        const id = lastLog().sessionCorrelationId;

        await request(app)
            .get('/probe')
            .set('Cookie', cookie)
            .set('Authorization', 'Bearer test-secret')
            .set('x-real-ip', '198.51.100.20');

        const log = lastLog();
        expect(log.sessionCorrelationId).toBe(id);
        expect(log.ownerId).toBe(OWNER_ID);
        expect(log.req.headers['x-real-ip']).toBe('198.51.100.20');
        expect(log.time).toEqual(expect.any(Number));
        expect(log.req.headers.cookie).toBe('[Redacted]');
        expect(log.req.headers.authorization).toBe('[Redacted]');
        expect(JSON.stringify(log)).not.toContain(cookie);
    });
});
