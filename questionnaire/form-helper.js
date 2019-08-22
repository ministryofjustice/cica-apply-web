'use strict';

const nunjucks = require('nunjucks');
const moment = require('moment');
const qTransformer = require('q-transformer')();
const uiSchema = require('./questionnaireUISchema');
const sectionList = require('./non-complex-sexual-assault-id-mapper');

nunjucks.configure(
    [
        'node_modules/govuk-frontend/',
        'node_modules/govuk-frontend/components/',
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

function renderSection(
    transformation,
    isFinal,
    backTarget,
    sectionId,
    showBackLink = true,
    csrfToken
) {
    const showButton = !isFinal;
    const isSummary = checkIsSummary(sectionId);
    const buttonTitle = getButtonText(sectionId);
    return nunjucks.renderString(
        `
            {% extends "page.njk" %}
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
                <form method="post" {%- if ${isSummary} %} action="/apply/submission/confirm"{% endif %}>
                    {% from "button/macro.njk" import govukButton %}
                        ${transformation}
                    {% if ${showButton} %}   
                        {{ govukButton({
                            text: "${buttonTitle}"
                        }) }}
                    {% endif %}
                    {% if ${csrfToken} %}
                        <input type="hidden" name="_csrf" value="${csrfToken}">
                    {% endif %}
                </form>
            {% endblock %}
        `
    );
}

function removeSectionIdPrefix(sectionId) {
    return sectionId.replace(/p-{1,2}/, '');
}

function inUiSchema(section) {
    if (uiSchema[section]) {
        return section;
    }
    if (uiSchema[`p-${section}`]) {
        return `p-${section}`;
    }
    if (uiSchema[`p--${section}`]) {
        return `p--${section}`;
    }
    return undefined;
}

function removeUnwantedHiddenAnswers(body, sectionId) {
    const answers = body;
    Object.keys(uiSchema[sectionId].options.properties).forEach(question => {
        if (uiSchema[sectionId].options.properties[question].options.conditionalComponentMap) {
            uiSchema[sectionId].options.properties[
                question
            ].options.conditionalComponentMap.forEach(mapping => {
                const truthyAnswer = answers[question] === 'true' || answers[question] === true;
                if (truthyAnswer !== mapping.itemValue) {
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

function correctPartialDates(body, property) {
    const answers = body;
    const value = answers[property];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const yearMonthDay = value.day
            ? `${value.year}-${value.month}-${value.day}`
            : `${value.year}-${value.month}-01`;

        // -- indicates no date parts have been provided
        if (yearMonthDay === '--' || yearMonthDay === '--01') {
            delete answers[property];
        } else {
            const date = moment(yearMonthDay).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            if (date !== null) {
                answers[property] = date;
            } else {
                answers[property] = `${yearMonthDay}T00:00:00.000Z`;
            }
        }
    }
    return answers;
}

function processRequest(rawBody, section) {
    // Handle conditionally revealing routes
    let body = rawBody;
    const sectionId = inUiSchema(section);
    if (sectionId && uiSchema[sectionId].options.properties) {
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

function getSectionHtml(sectionData, allAnswers, csrfToken) {
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
    const transformation = qTransformer.transform({
        schemaKey: sectionId,
        schema,
        uiSchema,
        data: answers
    });
    return renderSection(transformation, display.final, backLink, sectionId, csrfToken);
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
            } else if (err.meta.raw.params.errors && err.meta.raw.params.errors[0].params.limit) {
                const questionId = err.meta.raw.dataPath.substring(1);
                errorObject[questionId] = err.detail;
            } else if (err.meta.raw.params.errors && err.meta.raw.params.errors[0].params.format) {
                const questionId = err.meta.raw.dataPath.substring(1);
                errorObject[questionId] = err.detail;
            }
        });
    }
    return errorObject;
}

function getSectionHtmlWithErrors(sectionData, sectionId, csrfToken) {
    const {schema} = sectionData.meta;
    const errorObject = processErrors(sectionData.errors);
    const display = {final: false}; // sectionData.meta; // ToDo: Add these to meta for POST answers
    const backLink = `/apply/previous/${removeSectionIdPrefix(sectionId)}`;
    const {answers} = sectionData.meta;
    const transformation = qTransformer.transform({
        schemaKey: sectionId,
        schema,
        uiSchema,
        data: answers,
        schemaErrors: errorObject
    });
    return renderSection(transformation, display.final, backLink, sectionId, csrfToken);
}

function getNextSection(nextSectionId, requestedNextSectionId = undefined) {
    // Is there an override for the next section
    let nextSection = removeSectionIdPrefix(nextSectionId);
    if (requestedNextSectionId) {
        nextSection = removeSectionIdPrefix(requestedNextSectionId);
    }
    return nextSection;
}

function addPrefix(section) {
    return sectionList[section];
}

module.exports = {
    getButtonText,
    checkIsSummary,
    renderSection,
    removeSectionIdPrefix,
    inUiSchema,
    processRequest,
    getSectionHtml,
    getNextSection,
    removeEmptyAnswers,
    removeUnwantedHiddenAnswers,
    correctPartialDates,
    processErrors,
    processPreviousAnswers,
    getSectionHtmlWithErrors,
    addPrefix
};
