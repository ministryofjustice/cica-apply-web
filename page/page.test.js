/* eslint-disable global-require */

'use strict';

const createTemplateEngineService = require('../templateEngine');

describe('Page', () => {
    describe('Unauthenticated', () => {
        it('Should render the default GOV.UK header', () => {
            const templateEngineService = createTemplateEngineService();
            templateEngineService.init();
            const {render} = templateEngineService;
            const html = render('cookies.njk', {
                csrfToken: 'sometoken',
                isAuthenticated: false
            });
            const actual = html.replace(/\s+/g, '');
            const expected = `<header class="govuk-header" data-module="govuk-header">`.replace(
                /\s+/g,
                ''
            );
            expect(actual).toContain(expected);
        });
    });

    describe('Authenticated', () => {
        it('Should render the GOV.UK One Login header', async () => {
            const templateEngineService = createTemplateEngineService();
            templateEngineService.init();
            const {render} = templateEngineService;
            const html = render('cookies.njk', {
                csrfToken: 'sometoken',
                isAuthenticated: true
            });
            const actual = html.replace(/\s+/g, '');
            const expected = `<header class="rebranded-cross-service-header" data-module="one-login-header">`.replace(
                /\s+/g,
                ''
            );
            expect(actual).toContain(expected);
        });
    });
});
