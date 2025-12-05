/* eslint-disable global-require */

'use strict';

const request = require('supertest');
const getKeepAlive = require('../test/test-fixtures/res/get_keep_alive.json');

let app;

const mocks = {
    '../questionnaire/questionnaire-service': () => {
        return jest.fn(() => ({
            keepAlive: () => getKeepAlive
        }));
    },
    '../questionnaire/utils/isQuestionnaireInstantiated': () =>
        jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
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

describe('Session', () => {
    describe('keep-alive', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });
        it('Should return a session resource', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/session/keep-alive');
            expect(response.body).toEqual(getKeepAlive.body);
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => {
                            throw new Error('Something went wrong!');
                        }
                    }));
                }
            });
        });
        it('Should 404', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/session/keep-alive');
            expect(response.statusCode).toBe(404);
        });

        it('Should change the feedback link page to "page-not-found"', async () => {
            const response = await request(app).get('/session/keep-alive');

            expect(response.res.text).toContain(
                'https://www.smartsurvey.co.uk/s/inpagefeedback/?page=page-not-found'
            );
        });
    });
});
