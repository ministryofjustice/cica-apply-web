'use strict';

const nunjucks = require('nunjucks');
const isFilePath = require('./utils/isFilePath');

let environment;

function createTemplateEngineService(app) {
    function init() {
        if (environment) {
            return environment;
        }

        const configObject = {
            autoescape: true
        };

        if (app) {
            configObject.express = app;
        }

        environment = nunjucks
            .configure(
                [
                    `node_modules/@ministryofjustice/frontend/`,
                    `components/`,
                    `node_modules/govuk-frontend/dist/govuk/`,
                    `node_modules/govuk-frontend/dist/govuk/components/`,
                    `index/`,
                    `questionnaire/`,
                    `page/`,
                    `partials/`,
                    'account/pages/'
                ],
                configObject
            )
            .addGlobal('CW_GA_TRACKING_ID', process.env.CW_GA_TRACKING_ID)
            .addGlobal('CW_URL', process.env.CW_URL)
            .addGlobal('CW_DOMAIN', process.env.CW_DOMAIN)
            .addGlobal(
                'CW_MAINTENANCE_MESSAGE',
                !process.env?.CW_MAINTENANCE_MESSAGE?.length
                    ? 'maintenance message not set'
                    : process.env.CW_MAINTENANCE_MESSAGE
            )
            .addGlobal(
                'CW_MAINTENANCE_MESSAGE_ENABLED',
                process.env.CW_MAINTENANCE_MESSAGE_ENABLED === 'true'
            )
            .addGlobal('CW_APP_VERSION', process.env.npm_package_version)
            .addGlobal('CW_GOVUK_ACCOUNT_URL', process.env.CW_GOVUK_ACCOUNT_URL)
            .addGlobal('CW_BUILDTIME_ID', process.env.CW_BUILDTIME_ID)
            .addGlobal('govukRebrand', true);

        return environment;
    }

    function render(string, params) {
        if (isFilePath(string)) {
            return nunjucks.render(string, params);
        }
        return nunjucks.renderString(string, params);
    }

    function getEngine() {
        return nunjucks;
    }

    function getEnvironment() {
        return environment;
    }

    return Object.freeze({
        init,
        render,
        getEngine,
        getEnvironment
    });
}

module.exports = createTemplateEngineService;
