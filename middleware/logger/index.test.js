/* eslint-disable global-require */

'use strict';

jest.mock('pino-http', () => jest.fn(() => jest.fn()));
jest.mock('nanoid', () => ({nanoid: jest.fn(() => 'test-nanoid')}));

let pinoHttp;

describe('logger middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        pinoHttp = require('pino-http');

        jest.isolateModules(() => {
            require('./index');
        });
    });

    it('calls pinoHttp with the correct config', () => {
        expect(pinoHttp).toHaveBeenCalledTimes(1);
        expect(pinoHttp).toHaveBeenCalledWith({
            redact: [
                'req.headers.cookie',
                'req.headers.authorization',
                'req.headers["x-forwarded-for"]',
                'res.headers',
                'req.remoteAddress',
                'req.remotePort'
            ],
            genReqId: expect.any(Function),
            customSuccessObject: expect.any(Function),
            customErrorObject: expect.any(Function)
        });
    });

    it('genReqId returns x-request-id header when present', () => {
        const {genReqId} = pinoHttp.mock.calls[0][0];
        const req = {headers: {'x-request-id': 'abc-123'}};
        expect(genReqId(req)).toBe('abc-123');
    });

    it('genReqId returns first value when x-request-id is an array', () => {
        const {genReqId} = pinoHttp.mock.calls[0][0];
        const req = {headers: {'x-request-id': ['abc-123', 'def-456']}};
        expect(genReqId(req)).toBe('abc-123');
    });

    it('genReqId returns a nanoid when x-request-id header is absent', () => {
        const {genReqId} = pinoHttp.mock.calls[0][0];
        const req = {headers: {}};
        expect(genReqId(req)).toBe('test-nanoid');
    });

    it('includes questionnaireId, ownerId and sessionCorrelationId from session', () => {
        const {customSuccessObject} = pinoHttp.mock.calls[0][0];
        const req = {
            session: {
                questionnaireId: 'abc-123',
                ownerId: 'owner-456',
                sessionCorrelationId: 'session-789'
            }
        };
        const result = customSuccessObject(req, {}, {});
        expect(result).toMatchObject({
            questionnaireId: 'abc-123',
            ownerId: 'owner-456',
            sessionCorrelationId: 'session-789'
        });
    });

    it('returns undefined for questionnaireId, ownerId and sessionCorrelationId when session is absent', () => {
        const {customSuccessObject} = pinoHttp.mock.calls[0][0];
        const req = {};
        const result = customSuccessObject(req, {}, {});
        expect(result).toMatchObject({
            questionnaireId: undefined,
            ownerId: undefined,
            sessionCorrelationId: undefined
        });
    });

    it('includes questionnaireId, ownerId and sessionCorrelationId from session in error object', () => {
        const {customErrorObject} = pinoHttp.mock.calls[0][0];
        const req = {
            session: {
                questionnaireId: 'abc-123',
                ownerId: 'owner-456',
                sessionCorrelationId: 'session-789'
            }
        };
        const result = customErrorObject(req, {}, {}, {});
        expect(result).toMatchObject({
            questionnaireId: 'abc-123',
            ownerId: 'owner-456',
            sessionCorrelationId: 'session-789'
        });
    });

    it('uses the authenticated owner before the session owner has been updated', () => {
        const {customSuccessObject, customErrorObject} = pinoHttp.mock.calls[0][0];
        const req = {
            oidc: {user: {sub: 'authenticated-owner'}},
            session: {ownerId: 'anonymous-owner', sessionCorrelationId: 'session-789'}
        };

        expect(customSuccessObject(req, {}, {}).ownerId).toBe('authenticated-owner');
        expect(customErrorObject(req, {}, {}, {}).ownerId).toBe('authenticated-owner');
        expect(req.session.ownerId).toBe('anonymous-owner');
    });

    it('uses request logging context after logout clears the session', () => {
        const {customSuccessObject, customErrorObject} = pinoHttp.mock.calls[0][0];
        const req = {
            sessionLogContext: {
                ownerId: 'authenticated-owner',
                sessionCorrelationId: 'session-789'
            }
        };

        expect(customSuccessObject(req, {}, {})).toMatchObject(req.sessionLogContext);
        expect(customErrorObject(req, {}, {}, {})).toMatchObject(req.sessionLogContext);
        expect(req.session).toBeUndefined();
    });
});
