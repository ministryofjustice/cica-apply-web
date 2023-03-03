'use strict';

const request = require('supertest');
const csrf = require('csurf');

let app;

function replaceCsrfMiddlwareForTest(expressApp) {
    // TODO: find a better way to do this
    // because I cannot alter the contents of the variable that
    // is passed in to the `app.use()` method within the app.js,
    // I need to butcher the stack from the outside so that the
    // csrf stuff is altered after initialisation. If the csrf
    // stuff was extracted out its own middleware then we could
    // just that js file instead.
    // eslint-disable-next-line no-underscore-dangle
    const middlewareStack = expressApp._router.stack;
    let csrfMiddlewareStackIndex = -1;
    let newCsrfMiddlewareStackItem = [];
    let newCsrfMiddlewareStackIndex = -1;
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            csrfMiddlewareStackIndex = index;
        }
    });
    if (csrfMiddlewareStackIndex > -1) {
        // eslint-disable-next-line no-underscore-dangle
        expressApp._router.stack.splice(csrfMiddlewareStackIndex, 1);
    }

    const csrfProtection = csrf({
        cookie: false,
        sessionKey: 'session',
        ignoreMethods: ['GET', 'POST']
    });
    expressApp.use(csrfProtection);

    // look for the new csrf middleware. it should be the last item.
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            // get a copy of the new middleware.
            newCsrfMiddlewareStackItem = layer;
            newCsrfMiddlewareStackIndex = index;
            // remove it from the stack.
            // eslint-disable-next-line no-underscore-dangle
            expressApp._router.stack.splice(newCsrfMiddlewareStackIndex, 1);
        }
    });
    // eslint-disable-next-line no-underscore-dangle
    expressApp._router.stack.splice(csrfMiddlewareStackIndex, 0, newCsrfMiddlewareStackItem);
}

const mocks = {
    '../questionnaire/questionnaire-service': () => {
        return jest.fn(() => ({
            keepAlive: () => {
                return {body: {}};
            }
        }));
    },
    '../cookie/cookie-service': () => jest.fn(() => {}),
    '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => true)
};

function setUpCommonMocks(additionalMocks = {}) {
    jest.resetModules();
    jest.restoreAllMocks();
    const combinedMocks = {...mocks, ...additionalMocks};
    Object.keys(combinedMocks).forEach(path => {
        jest.unmock(path);
        jest.doMock(path, combinedMocks[path]);
    });
    // eslint-disable-next-line global-require
    app = require('../app');
    replaceCsrfMiddlwareForTest(app);
}

describe('app', () => {
    describe('Cookie middleware', () => {
        describe('`/session` condition', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });
            it('Should ignore the middleware if the URL starts with `/session`', async () => {
                // eslint-disable-next-line global-require
                const createCookieService = require('../cookie/cookie-service');
                const currentAgent = request.agent(app);
                await currentAgent.get('/session/keep-alive');
                expect(createCookieService).toHaveBeenCalledTimes(0);
            });
        });
        describe('`questionnaire insantiation` condition', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => false)
                });
            });
            it('Should ignore the middleware if a questionnaire is not instantiated', async () => {
                // eslint-disable-next-line global-require
                const createCookieService = require('../cookie/cookie-service');
                const currentAgent = request.agent(app);
                await currentAgent.get('/someurl');
                expect(createCookieService).toHaveBeenCalledTimes(0);
            });
        });
    });
});
