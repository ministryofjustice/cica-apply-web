const express = require('express');
const nunjucks = require('nunjucks');
const moment = require('moment');
const createQRouter = require('q-router');
const createQTransformer = require('q-transformer');
const createQValidator = require('q-validator');
const q = require('./questionnaire');
const uiSchema = require('./questionnaireUISchema');

const router = express.Router();
const qRouter = createQRouter(q);
const qTransformer = createQTransformer();
const qValidator = createQValidator();

nunjucks.configure(
    [
        'node_modules/govuk-frontend/',
        'node_modules/govuk-frontend/components/',
        'questionnaire/',
        'page/'
    ],
    {
        autoescape: true
    }
);

function getAnswerValues(answers) {
    if (!answers) {
        return {};
    }

    return Object.keys(answers).reduce((acc, answerId) => {
        const {value} = answers[answerId];

        if (Array.isArray(value)) {
            acc[`${answerId}[]`] = answers[answerId].value;
        } else {
            acc[answerId] = answers[answerId].value;
        }

        return acc;
    }, {});
}

router.get('/', (req, res) => {
    const section = qRouter.current();
    const schema = q.sections[section];
    const answers = getAnswerValues(q.answers[section]);
    const transformation = qTransformer.transform({
        schemaKey: section,
        schema,
        uiSchema,
        data: answers
    });

    const html = nunjucks.renderString(
        `
            {% extends "page.njk" %}
            {% block content %}
                ${transformation}
            {% endblock %}
        `
    );

    res.send(html);
});

router.post('/', (req, res) => {
    const {body} = req;

    // Handle req.body
    Object.keys(body).forEach(property => {
        const value = body[property];

        // Remove attributes from obj that have empty strings so that schema "requires" work
        if (typeof value === 'string' && value === '') {
            delete body[property];
        }

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // Tturn object dates to an iso string e.g. {day: 7, month: 3, year: 2018}
            body[property] = moment(body[property])
                .subtract(1, 'months')
                .toISOString();
        }
    });

    const currentSectionId = qRouter.current();
    const currentSchema = q.sections[currentSectionId];
    // Ajv mutates the data it's testing when using the coerce option
    const errors = qValidator.validationResponseAgainstSchema(currentSchema, body);

    if (!errors.valid) {
        const schema = q.sections[currentSectionId];
        const transformation = qTransformer.transform({
            schemaKey: currentSectionId,
            schema,
            uiSchema,
            data: body,
            schemaErrors: errors
        });
        const html = nunjucks.renderString(
            `
                {% extends "page.njk" %}
                {% block content %}

                    ${transformation}
                {% endblock %}
            `
        );

        res.send(html);
    } else {
        try {
            const nextSection = qRouter.next('ANSWER', body);
            const schema = q.sections[nextSection];
            const transformation = qTransformer.transform({
                schemaKey: nextSection,
                schema,
                uiSchema
            });

            const html = nunjucks.renderString(
                `
                    {% extends "page.njk" %}
                    {% block content %}
                        ${transformation}
                    {% endblock %}
                `
            );

            res.send(html);
        } catch (err) {
            console.error(err);
            console.log(
                JSON.stringify(
                    {
                        answers: q.answers,
                        progress: q.progress
                    },
                    null,
                    4
                )
            );
        }
    }
});

module.exports = router;
