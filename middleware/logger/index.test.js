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

    it('customSuccessObject includes questionnaireId and ownerId from session', () => {
        const {customSuccessObject} = pinoHttp.mock.calls[0][0];
        const req = {session: {questionnaireId: 'abc-123', ownerId: 'owner-456'}};
        const result = customSuccessObject(req, {}, {});
        expect(result).toMatchObject({questionnaireId: 'abc-123', ownerId: 'owner-456'});
    });

    it('customSuccessObject returns undefined for questionnaireId and ownerId when session is absent', () => {
        const {customSuccessObject} = pinoHttp.mock.calls[0][0];
        const req = {};
        const result = customSuccessObject(req, {}, {});
        expect(result).toMatchObject({questionnaireId: undefined, ownerId: undefined});
    });

    it('customErrorObject includes questionnaireId and ownerId from session', () => {
        const {customErrorObject} = pinoHttp.mock.calls[0][0];
        const req = {session: {questionnaireId: 'abc-123', ownerId: 'owner-456'}};
        const result = customErrorObject(req, {}, {}, {});
        expect(result).toMatchObject({questionnaireId: 'abc-123', ownerId: 'owner-456'});
    });
});
