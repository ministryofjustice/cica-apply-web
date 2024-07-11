'use strict';

const qTransformer = require('q-transformer')();
const uiSchema = require('./questionnaireUISchema');
const createTemplateEngineService = require('../templateEngine');

const templateEngineService = createTemplateEngineService();
const {render} = templateEngineService;
const shouldShowSignInLink = require('./utils/shouldShowSignInLink');

function getButtonText(sectionId, uiOptions) {
    if (uiOptions?.buttonText) {
        return uiOptions.buttonText;
    }
    if (
        sectionId in uiSchema &&
        uiSchema[sectionId].options &&
        uiSchema[sectionId].options.buttonText
    ) {
        return uiSchema[sectionId].options.buttonText;
    }

    return 'Continue';
}

function getSectionContext(sectionId) {
    return (
        sectionId in uiSchema &&
        uiSchema[sectionId].options &&
        uiSchema[sectionId].options.pageContext
    );
}

function renderSection({
    transformation,
    isFinal,
    pageType,
    backTarget,
    sectionId,
    showBackLink = true,
    csrfToken,
    cspNonce,
    isAuthenticated,
    userId,
    analyticsId,
    uiOptions = {},
    showSignInLink = shouldShowSignInLink(sectionId, uiSchema, isAuthenticated, uiOptions)
}) {
    const showButton = !isFinal;
    const buttonTitle = getButtonText(sectionId, uiOptions);
    const hasErrors = transformation.hasErrors === true;
    const hasButtonClass = uiOptions?.buttonClass !== undefined;
    const isContextPage = pageType === 'context';
    return render(
        `
            {% extends "page.njk" %}
            {% block pageTitle %}
                {%- if ${hasErrors} %}Error: {% endif %}${transformation.pageTitle} - {{ super() }}
            {% endblock %}
            {% block innerHeader %}
                <div class="govuk-grid-column-two-thirds">
                    {% if ${showBackLink} %}
                        {% from "back-link/macro.njk" import govukBackLink %}
                        {{ govukBackLink({
                            text: "Previous page",
                            href: "${backTarget}"
                        }) }}
                    {% endif %}
                </div>
                {% if ${showSignInLink} %}
                    <div class="govuk-grid-column-one-third">
                        <a href="/account/sign-in" class="govuk-link cica-prominent-link">Create a GOV.UK One Login to save your progress</a>
                    </div>
                {% endif %}
            {% endblock %}
            {% block innerContent %}
                {% if ${isContextPage} %}
                    <div aria-live="polite" style="position:absolute; left:-9999px;">
                        This page is for information and requires no action. Select continue to move on.
                    </div>
                {% endif %}
                <form method="post" novalidate autocomplete="off">
                    {% from "button/macro.njk" import govukButton %}
                        ${transformation.content}
                    {% if ${showButton} %}
                            {% if ${hasButtonClass} %}
                                {{ govukButton({
                                    text: "${buttonTitle}",
                                    classes: "${uiOptions.buttonClass}",
                                    preventDoubleClick: true
                                }) }}
                            {% else %}
                                 {{ govukButton({
                                    text: "${buttonTitle}",                          
                                    preventDoubleClick: true
                                }) }}                           
                            {% endif %}                       
                    {% endif %}
                    <input type="hidden" name="_csrf" value="${csrfToken}">
                </form>
            {% endblock %}
        `,
        {cspNonce, isAuthenticated, userId: isAuthenticated ? userId : undefined, analyticsId}
    );
}

function removeSectionIdPrefix(sectionId) {
    if (sectionId.startsWith('p--')) {
        return sectionId.replace(/^p--/, 'info-');
    }
    return sectionId.replace(/^p-/, '');
}

function removeUnwantedHiddenAnswers(body, sectionId) {
    const answers = body;
    Object.keys(uiSchema[sectionId].options.properties).forEach(question => {
        if (uiSchema[sectionId].options.properties[question].options.conditionalComponentMap) {
            uiSchema[sectionId].options.properties[
                question
            ].options.conditionalComponentMap.forEach(mapping => {
                let givenAnswer = answers[question];
                if (givenAnswer === 'true' || givenAnswer === true) {
                    givenAnswer = true;
                } else if (givenAnswer === 'false' || givenAnswer === false) {
                    givenAnswer = false;
                }

                if (Array.isArray(givenAnswer) && !givenAnswer.includes(mapping.itemValue)) {
                    // If checkbox answer is not relevant to the question
                    mapping.componentIds.forEach(id => {
                        delete answers[id]; // Delete it
                    });
                }

                if (!Array.isArray(givenAnswer) && givenAnswer !== mapping.itemValue) {
                    // If radio button answer is not relevant to the question
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
    let value = answers[property];

    // Remove attributes from obj that have empty strings,
    if (typeof value === 'string') {
        value = value.trim();

        if (value === '') {
            delete answers[property];
        } else {
            answers[property] = value;
        }
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
    if (section.startsWith('info-')) {
        return section.replace(/^info-/, 'p--');
    }
    return `p-${section}`;
}

function removeCarriageReturns(body, property) {
    const answers = body;
    const value = answers[property];

    // Remove carriage returns as these increase the character count causing validation error and are added by the http tranmission. They are not part of the original answer from frontend
    if (typeof value === 'string') {
        answers[property] = answers[property].replace(/\r\n/g, '\n');
    }
    return answers;
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
            body = removeCarriageReturns(body, question);
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

function getSectionHtml(sectionData, csrfToken, cspNonce, isAuthenticated, userId, analyticsId) {
    const {sectionId} = sectionData.data[0].attributes;
    const sectionDataMeta = sectionData.meta;
    const display = sectionData.meta;
    const schema = sectionData.included.filter(section => section.type === 'sections')[0]
        .attributes;
    const answersObject = processPreviousAnswers(
        sectionData.included.filter(answer => answer.type === 'answers')
    );
    const answers = answersObject[sectionId];
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

    const uiOptions = escapeSchemaContent(schema)?.options;
    return renderSection({
        transformation,
        isFinal: display.final,
        pageType: sectionDataMeta.pageType,
        backTarget: backLink,
        sectionId,
        showBackLink,
        csrfToken,
        cspNonce,
        isAuthenticated,
        userId,
        analyticsId,
        uiOptions
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

function getSectionHtmlWithErrors(
    sectionData,
    sectionId,
    csrfToken,
    cspNonce,
    isAuthenticated,
    userId,
    analyticsId
) {
    const {schema} = sectionData.meta;
    const sectionDataMeta = sectionData.meta;
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
    const uiOptions = escapeSchemaContent(schema)?.options;
    return renderSection({
        transformation,
        isFinal: false,
        pageType: sectionDataMeta.pageType,
        backTarget: backLink,
        sectionId,
        csrfToken,
        cspNonce,
        isAuthenticated,
        userId,
        analyticsId,
        uiOptions
    });
}

module.exports = {
    getButtonText,
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
    escapeSchemaContent,
    getSectionContext,
    removeCarriageReturns
};
