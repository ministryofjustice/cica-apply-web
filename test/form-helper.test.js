'use strict';

const formHelper = require('../questionnaire/form-helper');
const validTransformation = require('./test-fixtures/transformations/p-applicant-british-citizen-or-eu-national');
const validResolvedHtml = require('./test-fixtures/transformations/resolved html/p-applicant-british-citizen-or-eu-national');
const createTemplateEngineService = require('../templateEngine');

const templateEngineService = createTemplateEngineService();
templateEngineService.init();

const shouldShowSignInLink = require('../questionnaire/utils/shouldShowSignInLink');
const uiSchema = require('../questionnaire/questionnaireUISchema');

describe('form-helper functions', () => {
    describe('Remove sectionId prefix', () => {
        it('Should remove p- or p-- from the beginning of a valid sectionId', () => {
            const sectionId1 = 'p-applicant-some-section';
            const sectionId2 = 'p--some-section';
            const sectionId3 = 'problem';

            const expected1 = formHelper.removeSectionIdPrefix(sectionId1);
            const expected2 = formHelper.removeSectionIdPrefix(sectionId2);
            const expected3 = formHelper.removeSectionIdPrefix(sectionId3);

            expect(expected1).toEqual('applicant-some-section');
            expect(expected2).toEqual('some-section');
            expect(expected3).toEqual('problem');
        });

        it('Should return an invalid sectionId without mutating it', () => {
            const sectionId = 'problem-id-does-not-match-pattern';

            const expected = formHelper.removeSectionIdPrefix(sectionId);

            expect(expected).toEqual('problem-id-does-not-match-pattern');
        });
    });

    describe('Remove "empty" answers from an answer object', () => {
        it('Should return a valid sectionId given a section name exists in the questionnaire', () => {
            let body = {
                Q1: 'true',
                Q2: ''
            };
            const expected = {
                Q1: 'true'
            };

            Object.keys(body).forEach(property => {
                body = formHelper.removeEmptyAnswers(body, property);
            });

            expect(body).toEqual(expected);
        });
    });

    describe('Remove unused hidden answers from an answer object', () => {
        it('Should remove answers to conditionally revealing questions, given they should be hidden', () => {
            const body = {
                'q-applicant-have-you-applied-to-us-before': false,
                'q-enter-your-previous-reference-number': '11/111111'
            };
            const body2 = {
                'q-applicant-select-treatments-dmi': ['cbt'],
                'q-applicant-other-treatment-dmi': 'delete me'
            };

            const expected = {
                'q-applicant-have-you-applied-to-us-before': false
            };
            const expected2 = {
                'q-applicant-select-treatments-dmi': ['cbt']
            };

            const actual = formHelper.removeUnwantedHiddenAnswers(
                body,
                'p-applicant-have-you-applied-to-us-before'
            );
            const actual2 = formHelper.removeUnwantedHiddenAnswers(
                body2,
                'p-applicant-select-treatments'
            );

            expect(actual).toEqual(expected);
            expect(actual2).toEqual(expected2);
        });

        it('Should not remove answers to conditionally revealing questions if they are visible', () => {
            const body1 = {
                'q-applicant-have-you-applied-to-us-before': true,
                'q-enter-your-previous-reference-number': '11/111111'
            };
            const body2 = {
                'q-applicant-select-treatments-dmi': ['other'],
                'q-applicant-other-treatment-dmi': 'keep me'
            };

            const actual1 = formHelper.removeUnwantedHiddenAnswers(
                body1,
                'p-applicant-have-you-applied-to-us-before'
            );
            const actual2 = formHelper.removeUnwantedHiddenAnswers(
                body2,
                'p-applicant-select-treatments'
            );

            expect(actual1).toEqual(body1);
            expect(actual2).toEqual(body2);
        });
    });

    describe('Transform partial dates into isoStrings in an answer object', () => {
        it('Should convert date parts into IsoStrings', () => {
            let body = {
                'q-applicant-when-did-the-crime-happen': {day: '06', month: '09', year: '1987'}
            };

            const expected = {'q-applicant-when-did-the-crime-happen': `1987-09-06T00:00:00.000Z`};

            Object.keys(body).forEach(property => {
                body = formHelper.correctPartialDates(body, property);
            });

            expect(body).toEqual(expected);
        });

        it('Should set partial dates to the first of the entered month', () => {
            let body = {'q-applicant-when-did-the-crime-start': {month: '05', year: '2018'}};

            const expected = {'q-applicant-when-did-the-crime-start': `2018-05-01T00:00:00.000Z`};

            Object.keys(body).forEach(property => {
                body = formHelper.correctPartialDates(body, property);
            });

            expect(body).toEqual(expected);
        });
    });

    describe('Render page html', () => {
        it('Should return html given a valid transformation', () => {
            const transformation = validTransformation;
            const isFinal = false;
            const backTarget = '/apply/previous/applicant-british-citizen-or-eu-national';
            const sectionId = 'p-applicant-british-citizen-or-eu-national';
            const showBackLink = true;
            const expected = validResolvedHtml.replace(/\s+/g, '');
            const csrfToken = 'sometoken';
            const cspNonce = 'somenonce';

            const actual = formHelper
                .renderSection({
                    transformation,
                    isFinal,
                    backTarget,
                    sectionId,
                    showBackLink,
                    csrfToken,
                    cspNonce
                })
                .replace(/\s+/g, '');

            expect(actual).toMatch(expected);
        });

        it('Should show sign-in link when explicitly specified', () => {
            const transformation = validTransformation;
            const isFinal = false;
            const backTarget = '/apply/previous/applicant-when-did-the-crime-stop';
            const sectionId = 'p-applicant-when-did-the-crime-stop';
            const showBackLink = true;
            const csrfToken = 'sometoken';
            const cspNonce = 'somenonce';
            const showSignInLink = shouldShowSignInLink(sectionId, uiSchema);
            const expected = '<a href="/account/sign-in" class="govuk-link">Save and complete later</a>'.replace(
                /\s+/g,
                ''
            );

            const result = formHelper
                .renderSection({
                    transformation,
                    isFinal,
                    backTarget,
                    sectionId,
                    showBackLink,
                    csrfToken,
                    cspNonce,
                    showSignInLink
                })
                .replace(/\s+/g, '');

            expect(result).toEqual(expect.stringContaining(expected));
        });

        it('Should not show sign-in link when explicitly specified', () => {
            const transformation = validTransformation;
            const isFinal = false;
            const backTarget = '/apply/previous/applicant-who-are-you-applying-for';
            const sectionId = 'p-applicant-who-are-you-applying-for';
            const showBackLink = true;
            const csrfToken = 'sometoken';
            const cspNonce = 'somenonce';
            const showSignInLink = shouldShowSignInLink(sectionId, uiSchema);
            const expected = '<a href="/account/sign-in" class="govuk-link">Save and complete later</a>'.replace(
                /\s+/g,
                ''
            );

            const result = formHelper
                .renderSection({
                    transformation,
                    isFinal,
                    backTarget,
                    sectionId,
                    showBackLink,
                    csrfToken,
                    cspNonce,
                    showSignInLink
                })
                .replace(/\s+/g, '');

            expect(result).toEqual(expect.not.stringContaining(expected));
        });
    });

    describe('Process errors', () => {
        it('Should return a correctly formatted error', () => {
            const error = {
                errors: [
                    {
                        status: 400,
                        title: '400 Bad Request',
                        detail: 'Select yes if you are a British citizen or EU national',
                        code: 'errorMessage',
                        source: {
                            pointer: '/data/attributes'
                        },
                        meta: {
                            raw: {
                                keyword: 'errorMessage',
                                dataPath: '',
                                schemaPath: '#/errorMessage',
                                params: {
                                    errors: [
                                        {
                                            keyword: 'required',
                                            dataPath: '',
                                            schemaPath: '#/required',
                                            params: {
                                                missingProperty:
                                                    'q-applicant-british-citizen-or-eu-national'
                                            },
                                            message:
                                                "should have required property 'q-applicant-british-citizen-or-eu-national'"
                                        }
                                    ]
                                },
                                message: 'Select yes if you are a British citizen or EU national'
                            }
                        }
                    }
                ],
                meta: {
                    schema: {
                        type: 'object',
                        $schema: 'http://json-schema.org/draft-07/schema#',
                        required: ['q-applicant-british-citizen-or-eu-national'],
                        properties: {
                            'q-applicant-british-citizen-or-eu-national': {
                                type: 'boolean',
                                title: 'Are you a British citizen or EU national?'
                            }
                        },
                        errorMessage: {
                            required: {
                                'q-applicant-british-citizen-or-eu-national':
                                    'Select yes if you are a British citizen or EU national'
                            }
                        },
                        additionalProperties: false
                    },
                    answers: {}
                }
            };
            const expected = {
                'q-applicant-british-citizen-or-eu-national':
                    'Select yes if you are a British citizen or EU national'
            };
            const actual = formHelper.processErrors(error.errors);

            expect(actual).toMatchObject(expected);
        });

        it('Should return a list of correctly formatted errors given more than one', () => {
            const error = {
                errors: [
                    {
                        status: 400,
                        title: '400 Bad Request',
                        detail: 'Enter your title',
                        code: 'errorMessage',
                        source: {
                            pointer: '/data/attributes'
                        },
                        meta: {
                            raw: {
                                keyword: 'errorMessage',
                                dataPath: '',
                                schemaPath: '#/errorMessage',
                                params: {
                                    errors: [
                                        {
                                            keyword: 'required',
                                            dataPath: '',
                                            schemaPath: '#/required',
                                            params: {
                                                missingProperty: 'q-applicant-name-title'
                                            },
                                            message:
                                                "should have required property 'q-applicant-name-title'"
                                        }
                                    ]
                                },
                                message: 'Enter your title'
                            }
                        }
                    },
                    {
                        status: 400,
                        title: '400 Bad Request',
                        detail: 'Enter your forename',
                        code: 'errorMessage',
                        source: {
                            pointer: '/data/attributes'
                        },
                        meta: {
                            raw: {
                                keyword: 'errorMessage',
                                dataPath: '',
                                schemaPath: '#/errorMessage',
                                params: {
                                    errors: [
                                        {
                                            keyword: 'required',
                                            dataPath: '',
                                            schemaPath: '#/required',
                                            params: {
                                                missingProperty: 'q-applicant-enter-your-firstname'
                                            },
                                            message:
                                                "should have required property 'q-applicant-enter-your-firstname'"
                                        }
                                    ]
                                },
                                message: 'Enter your name'
                            }
                        }
                    }
                ],
                meta: {
                    schema: {
                        type: 'object',
                        $schema: 'http://json-schema.org/draft-07/schema#',
                        required: [
                            'q-applicant-enter-your-firstname',
                            'q-applicant-enter-your-title'
                        ],
                        properties: {
                            'q-applicant-enter-your-title': {
                                type: 'string',
                                title: 'Enter your title'
                            },
                            'q-applicant-enter-your-firstname': {
                                type: 'string',
                                title: 'Enter your name'
                            }
                        },
                        errorMessage: {
                            required: {
                                'q-applicant-enter-your-firstname': 'Enter your name',
                                'q-applicant-enter-your-title': 'Enter your title'
                            }
                        },
                        additionalProperties: false
                    },
                    answers: {}
                }
            };
            const expected = {
                'q-applicant-name-title': 'Enter your title',
                'q-applicant-enter-your-firstname': 'Enter your forename'
            };
            const actual = formHelper.processErrors(error.errors);

            expect(actual).toMatchObject(expected);
        });
    });

    describe('Process existing answers', () => {
        it('Should return a correctly formatted answer', () => {
            const answerObject = [
                {
                    links: {
                        self:
                            '/api/v1/questionnaires/d5aafe9b-5824-40e4-a05e-ae0203668168/sections/p-applicant-were-you-a-victim-of-sexual-assault-or-abuse/answers'
                    },
                    type: 'answers',
                    id: 'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse',
                    attributes: {'q-applicant-were-you-a-victim-of-sexual-assault-or-abuse': true}
                }
            ];
            const expected = {
                'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                    'q-applicant-were-you-a-victim-of-sexual-assault-or-abuse': true
                }
            };
            const actual = formHelper.processPreviousAnswers(answerObject);

            expect(actual).toMatchObject(expected);
        });

        it('Should return a list of correctly formatted errors given more than one', () => {
            const answerObject = [
                {
                    links: {
                        self:
                            '/api/v1/questionnaires/d5aafe9b-5824-40e4-a05e-ae0203668168/sections/p-applicant-were-you-a-victim-of-sexual-assault-or-abuse/answers'
                    },
                    type: 'answers',
                    id: 'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse',
                    attributes: {'question-one': 'answer-one', 'question-two': 'answer-two'}
                }
            ];
            const expected = {
                'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                    'question-one': 'answer-one',
                    'question-two': 'answer-two'
                }
            };
            const actual = formHelper.processPreviousAnswers(answerObject, {});

            expect(actual).toMatchObject(expected);
        });
    });

    describe('Get button text', () => {
        it('Should return the button text if specificed in the UISchema', () => {
            const sectionName = 'p-applicant-declaration';
            const expected = 'Agree and submit';

            const actual = formHelper.getFormSubmitButtonText(sectionName, uiSchema, false);

            expect(actual).toMatch(expected);
        });

        it('Should return the default button text if nothing specific is specified in the UISchema', () => {
            const sectionName = 'p--check-your-answers';
            const expected = 'Continue';

            const actual = formHelper.getFormSubmitButtonText(sectionName, uiSchema, false);

            expect(actual).toMatch(expected);
        });
    });

    describe('Check is summary', () => {
        it('Should return true if a section has `pageContext: summary` in the UISchema', () => {
            const sectionName = 'p--check-your-answers';

            const actual = formHelper.getSectionContext(sectionName) === 'summary';

            expect(actual).toEqual(true);
        });

        it('Should return false if a section has no `pageContext` value in the UISchema', () => {
            const sectionName = 'p--confirmation';

            const actual = formHelper.getSectionContext(sectionName) === 'summary';

            expect(actual).toEqual(false);
        });
    });

    describe('Check is submission', () => {
        it('Should return true if a section has `pageContext: submission` in the UISchema', () => {
            const sectionName = 'p-applicant-declaration';

            const actual = formHelper.getSectionContext(sectionName) === 'submission';

            expect(actual).toEqual(true);
        });

        it('Should return false if a section has no `pageContext` value in the UISchema', () => {
            const sectionName = 'p--confirmation';

            const actual = formHelper.getSectionContext(sectionName) === 'submission';

            expect(actual).toEqual(false);
        });
    });

    describe('Dates', () => {
        it('Should delete empty date answers', () => {
            const emptyObject = {};

            expect(
                formHelper.correctPartialDates({'q-date': {day: '', month: '', year: ''}}, 'q-date')
            ).toEqual(emptyObject);

            expect(
                formHelper.correctPartialDates({'q-date': {month: '', year: ''}}, 'q-date')
            ).toEqual(emptyObject);

            expect(formHelper.correctPartialDates({'q-date': {year: ''}}, 'q-date')).toEqual(
                emptyObject
            );

            expect(
                formHelper.correctPartialDates({'q-date': {day: '', year: ''}}, 'q-date')
            ).toEqual(emptyObject);
        });

        it('Should convert answers with all date parts to ISO date string', () => {
            expect(
                formHelper.correctPartialDates(
                    {'q-date': {day: '01', month: '01', year: '1970'}},
                    'q-date'
                )
            ).toEqual({
                'q-date': '1970-01-01T00:00:00.000Z'
            });
        });

        it('Should convert answers with missing day part to ISO date string', () => {
            expect(
                formHelper.correctPartialDates({'q-date': {month: '01', year: '1970'}}, 'q-date')
            ).toEqual({
                'q-date': '1970-01-01T00:00:00.000Z'
            });
        });

        it('Should convert answers with missing month part to ISO date string', () => {
            expect(
                formHelper.correctPartialDates({'q-date': {day: '01', year: '1970'}}, 'q-date')
            ).toEqual({
                'q-date': '1970-01-01T00:00:00.000Z'
            });
        });

        it('Should convert answers with single digit integer day part to ISO date string', () => {
            expect(
                formHelper.correctPartialDates(
                    {'q-date': {day: '1', month: '01', year: '1970'}},
                    'q-date'
                )
            ).toEqual({
                'q-date': '1970-01-01T00:00:00.000Z'
            });
        });

        it('Should convert answers with single digit integer month part to ISO date string', () => {
            expect(
                formHelper.correctPartialDates(
                    {'q-date': {day: '1', month: '1', year: '1970'}},
                    'q-date'
                )
            ).toEqual({
                'q-date': '1970-01-01T00:00:00.000Z'
            });
        });
    });

    describe('Escape schema content', () => {
        // Double escape any "\\" to work around this issue: https://github.com/mozilla/nunjucks/issues/625
        it('should escape "\\\\" with "\\\\\\\\"', () => {
            const schema = {
                additionalProperties: false,
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'object',
                properties: {
                    confirmation: {
                        description:
                            '\n                    {{ govukPanel({\n                        titleText: "Application submitted",\n                        html: \'<p>Your reference number is\\\n <strong>19\\751194</strong></p><p>We have sent a confirmation email to <strong>Barry.Kerr@cica.gov.uk</strong></p>\'\n                    }) }}\n                    \n                    <p class="govuk-body-l">Thank you for submitting your application.</p>\n                    <h2 class="govuk-heading-m">What happens next</h2>\n                    <p class="govuk-body">We will:</p>\n                    <ul class="govuk-list govuk-list--bullet">\n                    <li>ask the police for evidence</li>\n                    <li>use the police evidence to make a decision</li>\n                    <li>send our decision letter by post</li>\n                    </ul>\n                    {{ govukWarningText({\n                        text: "You must inform us immediately if any of the information you have given us changes, especially your address, telephone number or email address.",\n                        iconFallbackText: "Warning"\n                    }) }}\n                    <p class="govuk-body">You can contact our Customer Service Centre on 0300 003 3601. Select option 8 when the call is answered.</p>\n                    <h2 class="govuk-heading-m">Help us improve this service</h2>\n                    <p class="govuk-body">You can complete a short survey to help us improve this service.</p>\n                    <p class="govuk-body">It does not ask for any details about your case, and has no effect on your application.</p>\n                    <p class="govuk-body"><a href="https://www.surveymonkey.com/r/Privatebetafeedback">Tell us what you think of our service</a> (takes 30 seconds)</p>\n            '
                    }
                }
            };
            const expected = {
                additionalProperties: false,
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'object',
                properties: {
                    confirmation: {
                        description:
                            '\n                    {{ govukPanel({\n                        titleText: "Application submitted",\n                        html: \'<p>Your reference number is\\\\\n <strong>19\\\\751194</strong></p><p>We have sent a confirmation email to <strong>Barry.Kerr@cica.gov.uk</strong></p>\'\n                    }) }}\n                    \n                    <p class="govuk-body-l">Thank you for submitting your application.</p>\n                    <h2 class="govuk-heading-m">What happens next</h2>\n                    <p class="govuk-body">We will:</p>\n                    <ul class="govuk-list govuk-list--bullet">\n                    <li>ask the police for evidence</li>\n                    <li>use the police evidence to make a decision</li>\n                    <li>send our decision letter by post</li>\n                    </ul>\n                    {{ govukWarningText({\n                        text: "You must inform us immediately if any of the information you have given us changes, especially your address, telephone number or email address.",\n                        iconFallbackText: "Warning"\n                    }) }}\n                    <p class="govuk-body">You can contact our Customer Service Centre on 0300 003 3601. Select option 8 when the call is answered.</p>\n                    <h2 class="govuk-heading-m">Help us improve this service</h2>\n                    <p class="govuk-body">You can complete a short survey to help us improve this service.</p>\n                    <p class="govuk-body">It does not ask for any details about your case, and has no effect on your application.</p>\n                    <p class="govuk-body"><a href="https://www.surveymonkey.com/r/Privatebetafeedback">Tell us what you think of our service</a> (takes 30 seconds)</p>\n            '
                    }
                }
            };

            expect(formHelper.escapeSchemaContent(schema)).toEqual(expected);
        });
    });

    describe('Remove "carriage returns" from answer string', () => {
        it('Should return an answer with carriage returns removed', () => {
            let body = {
                Q1: 'foo\r\nbar\r\nfoo\r\nbar\r\nfoo\r\nbar foo bar.'
            };
            const expected = {
                Q1: 'foo\nbar\nfoo\nbar\nfoo\nbar foo bar.'
            };

            Object.keys(body).forEach(property => {
                body = formHelper.removeCarriageReturns(body, property);
            });

            expect(body).toMatchObject(expected);
        });
    });
});
