'use strict';

const nunjucks = require('nunjucks');
const qTransformer = require('q-transformer')();
const uiSchema = require('../questionnaire/questionnaireUISchema');

nunjucks.configure(
    [
        'node_modules/@ministryofjustice/frontend/',
        'components/',
        'node_modules/govuk-frontend/govuk/',
        'node_modules/govuk-frontend/govuk/components/',
        'index/',
        'questionnaire/',
        'page/',
        'partials/'
    ],
    {
        autoescape: true
    }
);

function renderSection({transformation, timestamp}) {
    return nunjucks.renderString(
        `
            {% extends "download.summary.njk" %}
            {% block pageTitle %}
                 Draft Application Summary - {{ super() }}
            {% endblock %}          
            {% block innerContent %}              
                ${transformation.content}      
            {% endblock %}    
            {% block downloadedTime %}${timestamp.format('LLLL')}{% endblock %}      
        `
    );
}

function escapeSchemaContent(schema) {
    // Double escape any "\\" to work around this issue: https://github.com/mozilla/nunjucks/issues/625
    const schemaAsJson = JSON.stringify(schema);
    const schemaWithEscapedContent = JSON.parse(schemaAsJson.replace(/\\\\/g, '\\\\\\\\'));

    return schemaWithEscapedContent;
}

function getSummaryHtml(sectionData, timestamp) {
    const {sectionId} = sectionData.data[0].attributes;
    const schema = sectionData.included.filter(section => section.type === 'sections')[0]
        .attributes;
    schema.downloadSummary = true; // adding this property on the fly
    const transformation = qTransformer.transform({
        schemaKey: sectionId,
        schema: escapeSchemaContent(schema),
        uiSchema
    });
    return renderSection({
        transformation,
        timestamp
    });
}

module.exports = {
    getSummaryHtml
};
