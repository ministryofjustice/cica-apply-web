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

function addPrefix(section) {
    return sectionList[section];
}

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
    variables = {},
    showBackLink = true
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
                <form method="post" {%- if ${isSummary} %} action="/apply/submission/confirm"{% endif %} novalidate>
                    {% from "button/macro.njk" import govukButton %}
                        ${transformation}
                    {% if ${showButton} %}   
                        {{ govukButton({
                            text: "${buttonTitle}"
                        }) }}
                    {% endif %}
                </form>
            {% endblock %}
        `,
        variables
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

function correctPartialDates(body, property, sectionId) {
    const answerObject = body;
    const answer = answerObject[property];
    const defaultDate = {
        day: '01',
        month: '01',
        year: '1970'
    };
    const correctedDateParts = {};
    let yearMonthDay = `${answer.year}-${answer.month}-${answer.day}`;
    // If it's a date answer
    if (
        answer &&
        typeof answer === 'object' &&
        !Array.isArray(answer) &&
        ('year' in answer || 'month' in answer || 'day')
    ) {
        // If partial dates are allowed
        if (
            uiSchema[sectionId] &&
            uiSchema[sectionId].options &&
            uiSchema[sectionId].options.properties &&
            uiSchema[sectionId].options.properties[property] &&
            uiSchema[sectionId].options.properties[property].options.dateParts
        ) {
            const {dateParts} = uiSchema[sectionId].options.properties[property].options;
            Object.keys(dateParts).forEach(part => {
                if (dateParts[part] && answer[part] === '') {
                    // Date part is required but missing
                    correctedDateParts[part] = null;
                } else if (!dateParts[part] && answer[part] === undefined) {
                    // Date part is not required, and empty so give it a default
                    correctedDateParts[part] = defaultDate[part];
                } else {
                    // Date part is valid
                    correctedDateParts[part] = answer[part];
                }
            });
            if (Object.values(correctedDateParts).includes(null)) {
                // if any are null, date object is null
                yearMonthDay = null;
            } else {
                yearMonthDay = `${correctedDateParts.year}-${correctedDateParts.month}-${correctedDateParts.day}`;
            }
        } else {
            // Else, partial dates are not allowed, each part is required.
            Object.keys(answer).forEach(datePart => {
                if (answer[datePart] === '') {
                    yearMonthDay = null;
                }
            });
        }
        if (yearMonthDay !== null) {
            const date = moment(`${yearMonthDay}T00:00:00.000Z`, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            if (date !== null) {
                answerObject[property] = `${yearMonthDay}T00:00:00.000Z`;
            }
        } else {
            delete answerObject[property];
        }
    }
    return answerObject;
}

function processRequest(rawBody, section) {
    // Handle conditionally revealing routes
    let body = rawBody;
    const sectionId = addPrefix(section) || '';
    if (uiSchema[sectionId] && uiSchema[sectionId].options.properties) {
        body = removeUnwantedHiddenAnswers(rawBody, sectionId);
    }
    if (Object.entries(body).length > 0 && body.constructor === Object) {
        Object.keys(body).forEach(question => {
            body = removeEmptyAnswers(body, question);
            body = correctPartialDates(body, question, sectionId);
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

function getSectionHtml(sectionData, allAnswers) {
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
    return renderSection(transformation, display.final, backLink, sectionId);
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

function getSectionHtmlWithErrors(sectionData, sectionId) {
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
    return renderSection(transformation, display.final, backLink, sectionId);
}

function getNextSection(nextSectionId, requestedNextSectionId = undefined) {
    // Is there an override for the next section
    let nextSection = removeSectionIdPrefix(nextSectionId);
    if (requestedNextSectionId) {
        nextSection = removeSectionIdPrefix(requestedNextSectionId);
    }
    return nextSection;
}

module.exports = {
    addPrefix,
    getButtonText,
    checkIsSummary,
    renderSection,
    removeSectionIdPrefix,
    removeUnwantedHiddenAnswers,
    removeEmptyAnswers,
    correctPartialDates,
    processRequest,
    processPreviousAnswers,
    getSectionHtml,
    processErrors,
    getSectionHtmlWithErrors,
    getNextSection
};
