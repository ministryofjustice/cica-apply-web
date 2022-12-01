'use strict';

const nunjucks = require('nunjucks');

function createNunjucksService() {
    nunjucks.configure(
        [
            'node_modules/@ministryofjustice/frontend/',
            'components/',
            'node_modules/govuk-frontend/govuk/',
            'node_modules/govuk-frontend/govuk/components/',
            'index/',
            'questionnaire/',
            'page/',
            'partials/',
            'account/'
        ],
        {
            autoescape: true
        }
    );

    function renderNunjucksString(nunjucksString, params = {}) {
        return nunjucks.renderString(nunjucksString, params);
    }

    return Object.freeze({
        renderNunjucksString
    });
}

module.exports = createNunjucksService;
