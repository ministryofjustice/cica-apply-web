'use strict';

const nunjucks = require('nunjucks');
const qTransformer = require('q-transformer')();
const uiSchema = require('./questionnaireUISchema');
const sectionList = require('./non-complex-sexual-assault-id-mapper');

nunjucks.configure(
    [
        'node_modules/govuk-frontend/govuk/',
        'node_modules/govuk-frontend/govuk/components/',
        'index/',
        'questionnaire/',
        'page/'
    ],
    {
        autoescape: true
    }
);

function getButtonText(sectionId) {
    return sectionId in uiSchema &&
        uiSchema[sectionId].options &&
        uiSchema[sectionId].options.buttonText
        ? uiSchema[sectionId].options.buttonText
        : 'Continue';
}

function checkIsSummary(sectionId) {
    return sectionId in uiSchema &&
        uiSchema[sectionId].options &&
        uiSchema[sectionId].options.isSummary
        ? uiSchema[sectionId].options.isSummary
        : false;
}

function renderSection({
    transformation,
    isFinal,
    backTarget,
    sectionId,
    showBackLink = true,
    csrfToken,
    cspNonce
}) {
    const showButton = !isFinal;
    const isSummary = checkIsSummary(sectionId);
    const buttonTitle = getButtonText(sectionId);
    const hasErrors = transformation.hasErrors === true;
    return nunjucks.renderString(
        `
            {% extends "page.njk" %}
            {% block pageTitle %}
                {%- if ${hasErrors} %}Error: {% endif %}${transformation.pageTitle} - {{ super() }}
            {% endblock %}
            {% block innerHeader %}
                {% if ${showBackLink} %}
                    {% from "back-link/macro.njk" import govukBackLink %}
                    {{ govukBackLink({
                        text: "Back",
                        href: "${backTarget}"
                    }) }}
                {% endif %}
            {% endblock %}
            {% block innerContent %}
                <form method="post" {%- if ${isSummary} %} action="/apply/submission/confirm"{% endif %} novalidate>
                    {% from "button/macro.njk" import govukButton %}
                        ${transformation.content}
                    {% if ${showButton} %}
                        {{ govukButton({
                            text: "${buttonTitle}"
                        }) }}
                    {% endif %}
                    <input type="hidden" name="_csrf" value="${csrfToken}">
                </form>
            {% endblock %}
        `,
        {nonce: cspNonce}
    );
}

function removeSectionIdPrefix(sectionId) {
    return sectionId.replace(/p-{1,2}/, '');
}

function removeUnwantedHiddenAnswers(body, sectionId) {
    const answers = body;
    Object.keys(uiSchema[sectionId].options.properties).forEach(question => {
        if (uiSchema[sectionId].options.properties[question].options.conditionalComponentMap) {
            uiSchema[sectionId].options.properties[
                question
            ].options.conditionalComponentMap.forEach(mapping => {
                // const truthyAnswer = answers[question] === 'true' || answers[question] === true;
                let givenAnswer;
                if (answers[question] === 'true' || answers[question] === true) {
                    givenAnswer = true;
                } else if (answers[question] === 'false' || answers[question] === false) {
                    givenAnswer = false;
                } else {
                    givenAnswer = answers[question];
                }
                if (givenAnswer !== mapping.itemValue) {
                    // If answer is not relevant to the question
                    mapping.componentIds.forEach(id => {
                        delete answers[id]; // Delete it
                    });
                }
            });
        }
    });
    return answers;
}

function removeEmptyAnswers(body, property) {
    const answers = body;
    const value = answers[property];

    // Remove attributes from obj that have empty strings so that schema "requires" work
    if (typeof value === 'string' && value === '') {
        delete answers[property];
    }
    return answers;
}

function correctPartialDates(body, questionId) {
    const answers = body;
    const dateParts = answers[questionId];

    if (
        dateParts &&
        typeof dateParts === 'object' &&
        !Array.isArray(dateParts) &&
        ('year' in dateParts || 'month' in dateParts || 'day' in dateParts)
    ) {
        // If no date parts are supplied delete the answer to trigger required error
        if (Object.values(dateParts).every(datePart => datePart === '')) {
            delete answers[questionId];
            return answers;
        }

        // Default omitted day/month object properties to "01"
        if (!('day' in dateParts)) {
            dateParts.day = '01';
        }

        if (!('month' in dateParts)) {
            dateParts.month = '01';
        }

        // Users can enter day/month as "7" or "07". Prefix single integer digits with "0"
        if (dateParts.day.match(/^[1-9]$/) !== null) {
            dateParts.day = `0${dateParts.day}`;
        }

        if (dateParts.month.match(/^[1-9]$/) !== null) {
            dateParts.month = `0${dateParts.month}`;
        }

        // Create an ISODateish string
        answers[questionId] = `${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00.000Z`;
    }

    return answers;
}

function addPrefix(section) {
    return sectionList[section];
}

function processRequest(rawBody, section) {
    // Handle conditionally revealing routes
    let body = rawBody;
    const sectionId = addPrefix(section);
    if (uiSchema[sectionId] && uiSchema[sectionId].options.properties) {
        body = removeUnwantedHiddenAnswers(rawBody, sectionId);
    }
    if (Object.entries(body).length > 0 && body.constructor === Object) {
        Object.keys(body).forEach(question => {
            body = removeEmptyAnswers(body, question);
            body = correctPartialDates(body, question);
        });
        return body;
    }
    return {};
}

function processPreviousAnswers(answersObject) {
    let answers = {};
    if (answersObject.length) {
        answers = answersObject.reduce((acc, answer) => {
            acc[answer.id] = answer.attributes;
            return acc;
        }, {});
    }
    return answers;
}

function escapeSchemaContent(schema) {
    // Double escape any "\\" to work around this issue: https://github.com/mozilla/nunjucks/issues/625
    const schemaAsJson = JSON.stringify(schema);
    const schemaWithEscapedContent = JSON.parse(schemaAsJson.replace(/\\\\/g, '\\\\\\\\'));

    return schemaWithEscapedContent;
}

function getSectionHtml(sectionData, allAnswers, csrfToken, cspNonce) {
    const {sectionId} = sectionData.data[0].attributes;
    const display = sectionData.meta;
    const schema = sectionData.included.filter(section => section.type === 'sections')[0]
        .attributes;
    let answers;
    if (Object.entries(allAnswers).length === 0 && allAnswers.constructor === Object) {
        const answersObject = processPreviousAnswers(
            sectionData.included.filter(answer => answer.type === 'answers')
        );
        answers = answersObject[sectionId];
    } else {
        answers = processPreviousAnswers(allAnswers.body.data);
    }
    const backLink = `/apply/previous/${removeSectionIdPrefix(sectionId)}`;

    const showBackLink = !(
        uiSchema[sectionId] && uiSchema[sectionId].options.showBackButton === false
    );

    const transformation = qTransformer.transform({
        schemaKey: sectionId,
        schema: escapeSchemaContent(schema),
        uiSchema,
        data: answers
    });

    return renderSection({
        transformation,
        isFinal: display.final,
        backTarget: backLink,
        sectionId,
        showBackLink,
        csrfToken,
        cspNonce
    });
}

function processErrors(errors) {
    const errorObject = {};
    if (!errors.valid) {
        errors.forEach(err => {
            if (
                err.meta.raw.params.errors &&
                err.meta.raw.params.errors[0].params.missingProperty
            ) {
                errorObject[err.meta.raw.params.errors[0].params.missingProperty] = err.detail;
            } else if (err.meta.raw.params.errors && err.meta.raw.params.errors[0].params) {
                const questionId = err.meta.raw.dataPath.substring(1);
                errorObject[questionId] = err.detail;
            }
        });
    }
    return errorObject;
}

function getSectionHtmlWithErrors(sectionData, sectionId, csrfToken, cspNonce) {
    const {schema} = sectionData.meta;
    const errorObject = processErrors(sectionData.errors);
    const backLink = `/apply/previous/${removeSectionIdPrefix(sectionId)}`;
    const {answers} = sectionData.meta;
    const transformation = qTransformer.transform({
        schemaKey: sectionId,
        schema,
        uiSchema,
        data: answers,
        schemaErrors: errorObject
    });
    return renderSection({
        transformation,
        isFinal: false,
        backTarget: backLink,
        sectionId,
        csrfToken,
        cspNonce
    });
}

module.exports = {
    getButtonText,
    checkIsSummary,
    renderSection,
    removeSectionIdPrefix,
    processRequest,
    getSectionHtml,
    removeEmptyAnswers,
    removeUnwantedHiddenAnswers,
    correctPartialDates,
    processErrors,
    processPreviousAnswers,
    getSectionHtmlWithErrors,
    addPrefix,
    escapeSchemaContent
};
