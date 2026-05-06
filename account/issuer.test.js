/* eslint-disable global-require */

'use strict';

const request = require('supertest');

let app;

const mocks = {
    got: jest.fn(() => {
        const got = () => undefined;
        got.extend = () =>
            jest.fn(options => {
                const responses = {
                    [`${process.env.CW_GOVUK_ISSUER_URL}/.well-known/openid-configuration`]: {
                        statusCode: 500
                    },
                    [`${process.env.CW_GOVUK_ISSUER_URL}/.well-known/oauth-authorization-server`]: {
                        statusCode: 500
                    }
                };
                return responses[options.url];
            });
        return got;
    })
};

function setUpCommonMocks(additionalMocks = {}) {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    const combinedMocks = {...mocks, ...additionalMocks};
    Object.keys(combinedMocks).forEach(path => {
        jest.unmock(path);
        if (combinedMocks[path] !== '__UNMOCK__') {
            jest.doMock(path, combinedMocks[path]);
        }
    });
    app = require('../app');
}

describe('OIDC issuer', () => {
    describe('Discover', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });
        it('Should render an outage page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/account/sign-in');
            expect(response.statusCode).toBe(500);
        });
        it('Should change the feedback link page to "oidc-provider-unreachable"', async () => {
            const response = await request(app).get('/account/sign-in');

            expect(response.res.text).toContain(
                'https://www.smartsurvey.co.uk/s/inpagefeedback/?page=oidc-provider-unreachable'
            );
        });
    });
});

describe('GOV.UK One Login rate limiting', () => {
    describe('temporarily_unavailable error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../account/routes': () => {
                    const express = require('express');
                    const router = express.Router();
                    router.get('/rate-limit-test', (req, res, next) => {
                        const err = new Error('temporarily_unavailable');
                        err.error = 'temporarily_unavailable';
                        next(err);
                    });
                    return router;
                }
            });
        });

        it('Should return a 503 status code', async () => {
            const response = await request(app).get('/account/rate-limit-test');
            expect(response.statusCode).toBe(503);
        });

        it('Should render the oidc-provider-unreachable template with oidc-rate-limit section', async () => {
            const response = await request(app).get('/account/rate-limit-test');
            expect(response.res.text).toContain(
                'https://www.smartsurvey.co.uk/s/inpagefeedback/?page=oidc-rate-limit'
            );
        });
    });
});
