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
        'index/',
        'questionnaire/',
        'page/'
    ],
    {
        autoescape: true
    }
);

function getPageHTML(transformation, sectionId, isNotFirst, csrfToken) {
    const backLink = isNotFirst ? `/apply/previous/${sectionId}` : '/start-page';
    return nunjucks.renderString(
        `
            {% extends "page.njk" %}
            {% block innerHeader %}
                {% from "back-link/macro.njk" import govukBackLink %}
                {{ govukBackLink({
                    text: "Back",
                    href: "${backLink}"
                }) }}
            {% endblock %}
            {% block innerContent %}
                <form method="post">
                    ${transformation}
                    <input type="hidden" id="csrf" name="_csrf" value="${csrfToken}" /></p>
                </form>
            {% endblock %}
        `
    );
}

/* eslint-disable-next-line */
function logProgress(req, questionnaire) {
    console.log('\n\n\n-------------------');
    console.log(req.method, ': ', req.url);
    console.log(
        'PROGRESS: ',
        JSON.stringify(
            {
                answers: questionnaire.answers
            },
            null,
            4
        )
    );
    console.log('-------------------\n\n\n');
}

function processRequest(reqBody) {
    const body = reqBody;

    // the CSRF token in not in the schemas.
    // we don't want to pass the CSRF token in to the
    // validator because will always fail when being
    // checked against a schema.
    /* eslint-disable no-underscore-dangle */
    if (body._csrf) {
        delete body._csrf;
    }
    /* eslint-enable no-underscore-dangle */

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
            const yearMonthDay = dateParts.day
                ? `${dateParts.year}-${dateParts.month}-${dateParts.day}`
                : `${dateParts.year}-${dateParts.month}-01`;

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

function validSectionIdFormat(sectionId) {
    const rxValidSectionId = /^[a-z0-9]{1,30}(-[a-z0-9]{1,30})*$/;

    return rxValidSectionId.test(sectionId);
}

function getSection(sectionId) {
    if (!validSectionIdFormat(sectionId)) {
        return undefined;
    }

    let section = qRouter.current(`p-${sectionId}`);

    if (!section) {
        section = qRouter.current(`p--${sectionId}`);

        if (!section) {
            return undefined;
        }
    }

    return section;
}

router.route('/').get((req, res) => {
    const section = removeSectionIdPrefix(qRouter.current().context.routes.initial);

    res.redirect(`${req.baseUrl}/${section}`);
});

router.get('/previous/:section', (req, res) => {
    const section = getSection(req.params.section);

    if (section) {
        const prev = `${req.baseUrl}/${removeSectionIdPrefix(qRouter.previous(section.id).id)}`;

        res.redirect(prev);
    } else {
        res.status(404).render('404.njk');
    }
});

router
    .route('/:section')
    .get((req, res) => {
        const section = getSection(req.params.section);

        if (section) {
            const sectionId = section.id;
            const questionnaire = section.context;
            const schema = questionnaire.sections[sectionId];
            const {answers} = questionnaire;
            const scopedAnswers =
                sectionId === 'p--check-your-answers' ? answers : answers[sectionId];
            const transformation = qTransformer.transform({
                schemaKey: sectionId,
                schema,
                uiSchema,
                data: scopedAnswers
            });
            const html = getPageHTML(
                transformation,
                removeSectionIdPrefix(sectionId),
                questionnaire.progress[0] !== sectionId,
                req.session.CSRFTOKEN
            );

            res.send(html);
        } else {
            res.status(404).render('404.njk');
        }
    })
    .post((req, res) => {
        const section = getSection(req.params.section);

        if (section) {
            const sectionId = section.id;
            const questionnaire = section.context;
            const {body} = req;

            processRequest(body);

            const currentSchema = questionnaire.sections[sectionId];
            // Ajv mutates the data it's testing when using the coerce option
            const errors = qValidator.validationResponseAgainstSchema(currentSchema, body);

            if (!errors.valid) {
                const schema = questionnaire.sections[sectionId];
                const transformation = qTransformer.transform({
                    schemaKey: sectionId,
                    schema,
                    uiSchema,
                    data: body,
                    schemaErrors: errors
                });
                const html = getPageHTML(
                    transformation,
                    removeSectionIdPrefix(sectionId),
                    questionnaire.progress,
                    req.session.CSRFTOKEN
                );

                // logProgress(questionnaire);

                res.send(html);
            } else {
                let nextSectionId = removeSectionIdPrefix(qRouter.next(body, sectionId).id);
                const requestedNextSectionId = req.query.next;

                // Is there an override for the next section
                if (requestedNextSectionId) {
                    const nextSection = getSection(requestedNextSectionId);

                    if (nextSection) {
                        nextSectionId = removeSectionIdPrefix(nextSection.id);
                    }
                }

                // logProgress(req, questionnaire);

                res.redirect(`${req.baseUrl}/${nextSectionId}`);
            }
        } else {
            res.status(404).render('404.njk');
        }
    });

module.exports = router;
