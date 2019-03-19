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

function getPageHTML(transformation) {
    return nunjucks.renderString(
        `
            {% extends "page.njk" %}
            {% block content %}
                {% from "back-link/macro.njk" import govukBackLink %}
                {{ govukBackLink({
                    text: "Back",
                    href: "/apply/previous"
                }) }}
                ${transformation}
            {% endblock %}
        `
    );
}

function logProgress(questionnaire) {
    console.log(
        'PROGRESS: ',
        JSON.stringify(
            {
                answer: questionnaire.answers,
                progress: questionnaire.progress
            },
            null,
            4
        )
    );
}

function processRequest(reqBody) {
    const body = reqBody;

    // Handle req.body
    Object.keys(body).forEach(property => {
        const value = body[property];

        // Remove attributes from obj that have empty strings so that schema "requires" work
        if (typeof value === 'string' && value === '') {
            delete body[property];
        }

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // 1980-02-01T00:00:00.000Z

            const dateParts = body[property];
            const yearMonthDay = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;

            // -- indicates no date parts have been provided
            if (yearMonthDay === '--') {
                delete body[property];
            } else {
                const date = moment(yearMonthDay, ['YYYY-MM-DD', 'YYYY-M-D'], true).toISOString();

                if (date !== null) {
                    body[property] = date;
                } else {
                    body[property] = `${yearMonthDay}T00:00:00.000Z`;
                }
            }
        }
    });
}

function removeSectionIdPrefix(sectionId) {
    return sectionId.replace(/p-{1,2}/, '');
}

function prefixSectionId(sectionId, questionnaireRouter) {
    let prefixedSectionId = `p-${sectionId}`;

    if (prefixedSectionId in questionnaireRouter.questionnaire.sections) {
        return prefixedSectionId;
    }

    prefixedSectionId = `p--${sectionId}`;

    if (prefixedSectionId in questionnaireRouter.questionnaire.sections) {
        return prefixedSectionId;
    }

    return null;
}

function validSectionIdFormat(sectionId) {
    const rxValidSectionId = /^[a-z0-9]{1,30}(-[a-z0-9]{1,30})*$/;

    return rxValidSectionId.test(sectionId);
}

function validSectionId(sectionId, questionnaireRouter) {
    if (validSectionIdFormat(sectionId)) {
        const prefixedSectionId = prefixSectionId(sectionId, questionnaireRouter);

        if (
            prefixedSectionId &&
            (questionnaireRouter.current() === prefixedSectionId ||
                questionnaireRouter.questionnaire.progress.includes(prefixedSectionId))
        ) {
            return prefixedSectionId;
        }
    }

    return false;
}

router.route('/').get((req, res) => {
    const section = removeSectionIdPrefix(qRouter.questionnaire.routes.initial);

    res.redirect(`${req.baseUrl}/${section}`);
});

router.get('/previous', (req, res) => {
    const prev = `${req.baseUrl}/${removeSectionIdPrefix(qRouter.previous())}`;

    console.log('~~~~~~~: ', prev);

    res.redirect(prev);
});

router
    .route('/:section')
    .get((req, res) => {
        const {section} = req.params;
        const sectionId = validSectionId(section, qRouter);

        console.log('############## get: ', {
            progress: q.progress,
            current: qRouter.current(),
            url: req.params.section,
            sectionId
        });
        if (sectionId) {
            const schema = q.sections[sectionId];
            const answers = getAnswerValues(q.answers[sectionId]);
            const transformation = qTransformer.transform({
                schemaKey: sectionId,
                schema,
                uiSchema,
                data: answers
            });

            const html = getPageHTML(transformation);

            res.send(html);
        } else {
            res.status(404).render('404.njk');
        }
    })
    .post((req, res) => {
        const {body} = req;
        const {section} = req.params;
        const sectionId = validSectionId(section, qRouter);

        console.log('############## post: ', {
            progress: q.progress,
            current: qRouter.current(),
            url: req.params.section
        });

        if (sectionId) {
            processRequest(body);

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
                const html = getPageHTML(transformation);

                logProgress(q);

                res.send(html);
            } else {
                try {
                    const nextSection = removeSectionIdPrefix(
                        qRouter.next('ANSWER', body, sectionId)
                    );

                    console.log('@@@@@: ', {
                        progress: q.progress,
                        current: qRouter.current(),
                        url: req.params.section
                    });

                    res.redirect(`${req.baseUrl}/${nextSection}`);
                } catch (err) {
                    console.error(err);
                    logProgress(q);
                }
            }
        } else {
            res.status(404).render('404.njk');
        }
    });

module.exports = router;
