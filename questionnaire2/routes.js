const express = require('express');
const nunjucks = require('nunjucks');
const createQRouter = require('q-router');
const createQTransformer = require('q-transformer');
const createQValidator = require('q-validator');
const q = require('./questionnaire');

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
    // Ajv mutates the data it's testing when using the coerce option
    // Create a copy to avoid issues
    const bodyCopy = Object.assign({}, body);
    const currentSectionId = qRouter.current();
    const currentSchema = q.sections[currentSectionId];
    const errors = qValidator.validationResponseAgainstSchema(currentSchema, bodyCopy);

    if (!errors.valid) {
        res.send(errors);
    }

    const nextSection = qRouter.next('ANSWER', body);
    const schema = q.sections[nextSection];
    const transformation = qTransformer.transform({
        schemaKey: nextSection,
        schema,
        uiSchema: {}
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

router.get('/form', (req, res) => {
    res.render('form.njk');
});

router.post('/form', (req, res) => {
    console.log('BODY: ', req.body);

    res.send('POSTED!!');
});

module.exports = router;
