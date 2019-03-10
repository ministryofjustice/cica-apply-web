const express = require('express');
const nunjucks = require('nunjucks');
const createQRouter = require('q-router');
const createQTransformer = require('q-transformer');
const createQValidator = require('q-validator');
const q = require('./questionnaire');
const startPageString = require('../page/start-page');

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

router.get('/', (req, res) => {
    const section = qRouter.current();
    const schema = q.sections[section];
    const transformation = qTransformer.transform({
        schemaKey: section,
        schema,
        uiSchema: {}
    });

    const templateString =
        schema.context === 'start-page'
            ? startPageString
            : `
            {% extends "page.njk" %}
            {% block innerContent %}
                ${transformation}
            {% endblock %}
        `;

    const html = nunjucks.renderString(templateString);

    res.send(html);
});

router.post('/', (req, res) => {
    const {body} = req;
    // Ajv mutates the data it's testing when using the coerce option
    // Create a copy to avoid issues
    const bodyCopy = Object.assign({}, body);

    // Handle req.body
    Object.keys(bodyCopy).forEach(property => {
        const value = bodyCopy[property];

        // Remove attributes from obj that have empty strings so that schema "requires" work
        if (typeof value === 'string' && value === '') {
            delete bodyCopy[property];
        }

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // todo: install moment and turn object dates to an iso string e.g. {day: 7, month: 3, year: 2018}
            // simulate date string
            bodyCopy[property] = '2018-03-07T18:04:57.608Z';
        }
    });
    const currentSectionId = qRouter.current();
    const currentSchema = q.sections[currentSectionId];
    const errors = qValidator.validationResponseAgainstSchema(currentSchema, bodyCopy);
    if (!errors.valid) {
        const schema = q.sections[currentSectionId];
        const transformation = qTransformer.transform({
            schemaKey: currentSectionId,
            schema,
            uiSchema: {},
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
        const nextSection = qRouter.next('ANSWER', body);
        const schema = q.sections[nextSection];
        const transformation = qTransformer.transform({
            schemaKey: nextSection,
            schema,
            uiSchema: {}
        });

        // ToDo: {% block beforeContent %}
        // ToDo: Implement back button nunjucks <a href="/{{questionnaireId}}/{{questionnaireName}}/previous" class="govuk-back-link">Back</a>
        // ToDo: {% endblock %}

        const html = nunjucks.renderString(
            `
                {% extends "page.njk" %}
                {% block content %}
                    ${transformation}
                {% endblock %}
            `
        );
        res.send(html);
    }
});

router.get('/form', (req, res) => {
    res.render('form.njk');
});

router.post('/form', (req, res) => {
    console.log('BODY: ', req.body);

    res.send('POSTED!!');
});

module.exports = router;
