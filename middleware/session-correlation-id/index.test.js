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

    it('does not add an ID to an unauthenticated session', () => {
        const req = {
            oidc: {isAuthenticated: () => false},
            session: {}
        };
        const next = jest.fn();

        sessionCorrelationId(req, {}, next);

        expect(req.session.sessionCorrelationId).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
