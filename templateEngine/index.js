'use strict';

const nunjucks = require('nunjucks');
const isFilePath = require('./utils/isFilePath');

let environment;
let defaultTemplateParams = {};

function createTemplateEngineService(app) {
    function init(defaultParams = {}) {
        defaultTemplateParams = defaultParams;

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
                    `node_modules/govuk-frontend/govuk/`,
                    `node_modules/govuk-frontend/govuk/components/`,
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
            .addGlobal('CW_LIVECHAT_CHAT_ID', process.env.CW_LIVECHAT_CHAT_ID)
            .addGlobal(
                'CW_LIVECHAT_MAINTENANCE_MESSAGE',
                !process.env?.CW_LIVECHAT_MAINTENANCE_MESSAGE?.length
                    ? 'maintenance message not set'
                    : process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE
            )
            .addGlobal(
                'CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED',
                process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED === 'true'
            )
            .addGlobal(
                'CW_MAINTENANCE_MESSAGE',
                !process.env?.CW_MAINTENANCE_MESSAGE?.length
                    ? 'maintenance message not set'
                    : process.env.CW_MAINTENANCE_MESSAGE
            )
            .addGlobal(
                'CW_MAINTENANCE_MESSAGE_ENABLED',
                process.env.CW_MAINTENANCE_MESSAGE_ENABLED === 'true'
            );

        return environment;
    }

    function render(string, params) {
        if (isFilePath(string)) {
            return nunjucks.render(string, {
                ...defaultTemplateParams,
                ...params
            });
        }
        return nunjucks.renderString(string, {
            ...defaultTemplateParams,
            ...params
        });
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
