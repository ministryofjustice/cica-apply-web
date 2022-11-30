'use strict';

const request = require('supertest');

let app;

function startApp() {
    // eslint-disable-next-line global-require
    app = require('../app');
}

describe('Live Chat', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(Date, 'now').mockImplementation(() => 1631538356000);
        process.env = {...OLD_ENV};
    });

    afterEach(() => {
        jest.clearAllMocks();
        process.env = OLD_ENV;
    });

    describe('Withdrawal', () => {
        it('Should not withdraw the Live Chat service', async () => {
            process.env.CW_LIVECHAT_ALIVE = 'true';
            startApp();
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'You can ask about claiming compensation or discuss your claim.';
            expect(actual).toContain(expected);
        });

        it('Should withdraw the Live Chat service', async () => {
            process.env.CW_LIVECHAT_ALIVE = 'anythingbutstringtrue';
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'Our live chat service has been withdrawn';
            expect(actual).toContain(expected);
        });
    });

    describe('Enabling', () => {
        it('Should enable the Live Chat service', async () => {
            process.env.CW_LIVECHAT_DISABLED = 'false';
            startApp();
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'You can ask about claiming compensation or discuss your claim.';
            expect(actual).toContain(expected);
        });
    });

    describe('Disabling', () => {
        it('Should disable the Live Chat service', async () => {
            process.env.CW_LIVECHAT_DISABLED = 'true';
            startApp();
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'Sorry, the service is unavailable';
            expect(actual).toContain(expected);
        });
    });

    describe('Maintenance message', () => {
        it('Should display the maintenance banner', async () => {
            process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
            startApp();
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'class="moj-banner__message"';
            expect(actual).toContain(expected);
        });

        it('Should not display the maintenance banner', async () => {
            process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'false';
            startApp();
            const response = await request(app).get('/start-chat');
            const actual = response.res.text;
            const expected = 'class="moj-banner__message"';
            expect(actual).not.toContain(expected);
        });

        describe('Maintenance message content', () => {
            it('Should display default maintenance banner content if env var is not present', async () => {
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
                delete process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE;
                startApp();
                const response = await request(app).get('/start-chat');
                const actual = response.res.text;
                const expected = 'maintenance message not set';
                expect(actual).toContain(expected);
            });

            it('Should display default maintenance banner content if env var is "undefined"', async () => {
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE = undefined;
                startApp();
                const response = await request(app).get('/start-chat');
                const actual = response.res.text;
                const expected = 'maintenance message not set';
                expect(actual).toContain(expected);
            });

            it('Should display default maintenance banner content if env var is "null"', async () => {
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE = null;
                startApp();
                const response = await request(app).get('/start-chat');
                const actual = response.res.text;
                const expected = 'maintenance message not set';
                expect(actual).toContain(expected);
            });

            it('Should display default maintenance banner content if env var is an empty string', async () => {
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE = '';
                startApp();
                const response = await request(app).get('/start-chat');
                const actual = response.res.text;
                const expected = 'maintenance message not set';
                expect(actual).toContain(expected);
            });

            it('Should display custom maintenance banner content', async () => {
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE = 'custom banner message';
                startApp();
                const response = await request(app).get('/start-chat');
                const actual = response.res.text;
                const expected = 'custom banner message';
                expect(actual).toContain(expected);
            });
        });
    });
});
