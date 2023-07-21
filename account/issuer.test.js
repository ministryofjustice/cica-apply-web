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
    });
});
