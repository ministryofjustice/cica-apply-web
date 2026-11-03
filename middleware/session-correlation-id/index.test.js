'use strict';

const sessionCorrelationId = require('./index');

describe('session correlation ID middleware', () => {
    it('sets a stable correlation ID for an authenticated session', () => {
        const req = {
            oidc: {isAuthenticated: () => true},
            session: {}
        };
        const next = jest.fn();

        sessionCorrelationId(req, {}, next);
        const firstId = req.session.sessionCorrelationId;
        sessionCorrelationId(req, {}, next);

        expect(firstId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(req.session.sessionCorrelationId).toBe(firstId);
        expect(next).toHaveBeenCalledTimes(2);
    });

    it('captures only the correlation ID and authenticated owner for request logging', () => {
        const req = {
            oidc: {isAuthenticated: () => true, user: {sub: 'authenticated-owner'}},
            session: {
                ownerId: 'previous-owner',
                sessionCorrelationId: 'session-123',
                id_token: 'test-token'
            }
        };

        sessionCorrelationId(req, {}, jest.fn());
        req.session = undefined;

        expect(req.sessionLogContext).toEqual({
            ownerId: 'authenticated-owner',
            sessionCorrelationId: 'session-123'
        });
    });

    it('does not add an ID to an unauthenticated session', () => {
        const req = {
            oidc: {isAuthenticated: () => false},
            session: {}
        };
        const next = jest.fn();

        sessionCorrelationId(req, {}, next);

        expect(req.session.sessionCorrelationId).toBeUndefined();
        expect(req.sessionLogContext).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
