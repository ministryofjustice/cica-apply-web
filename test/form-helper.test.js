'use strict';

const formHelper = require('../questionnaire/form-helper');
const validTransformation = require('./test-fixtures/transformations/p-applicant-british-citizen-or-eu-national');
const validResolvedHtml = require('./test-fixtures/transformations/resolved html/p-applicant-british-citizen-or-eu-national');
const sectionDataWithErrors = require('./test-fixtures/res/post_section_returned_errors');
const sectionDataValid = require('./test-fixtures/res/get_section');
const sectionDataConfirmation = require('./test-fixtures/res/get_section_confirmation');
const sectionDataWithNonRequiredErrors = require('./test-fixtures/res/post_section_returned_errors_not_required');
const sectionDataWithManyNonRequiredErrors = require('./test-fixtures/res/post_section_returned_multiple_errors_not_required');

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
            const body1 = {
                'q-applicant-who-did-you-apply-to': 'Another type of compo',
                'q-how-much-was-award': '5000',
                'q-applicant-has-a-decision-been-made': 'false',
                'q-when-will-you-find-out': "Don't know"
            };
            const body2 = {
                'q-applicant-who-did-you-apply-to': 'Another type of compo',
                'q-how-much-was-award': '5000',
                'q-applicant-has-a-decision-been-made': 'true',
                'q-when-will-you-find-out': "Don't know"
            };
            const expected1 = {
                'q-applicant-who-did-you-apply-to': 'Another type of compo',
                'q-applicant-has-a-decision-been-made': 'false',
                'q-when-will-you-find-out': "Don't know"
            };
            const expected2 = {
                'q-applicant-who-did-you-apply-to': 'Another type of compo',
                'q-how-much-was-award': '5000',
                'q-applicant-has-a-decision-been-made': 'true'
            };

            const actual1 = formHelper.removeUnwantedHiddenAnswers(
                body1,
                'p-applicant-other-compensation-details'
            );
            const actual2 = formHelper.removeUnwantedHiddenAnswers(
                body2,
                'p-applicant-other-compensation-details'
            );

            expect(actual1).toEqual(expected1);
            expect(actual2).toEqual(expected2);
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

        it('Should set partial dates to their default value', () => {
            let body = {
                'q-applicant-when-did-the-crime-start': {month: '05', year: '2018'}
            };

            const expected = {
                'q-applicant-when-did-the-crime-start': `2018-05-01T00:00:00.000Z`
            };

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
    });

    describe('Process errors', () => {
        describe('Missing property errors - User has not entered a required value', () => {
            it('Should return a correctly formatted error', () => {
                const error = sectionDataWithErrors.body;
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
                                                    missingProperty:
                                                        'q-applicant-enter-your-firstname'
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
        describe('All other types of error', () => {
            it('Should return a correctly formatted error', () => {
                const error = sectionDataWithNonRequiredErrors.body;
                const expected = {
                    'q--when-was-the-crime-reported-to-police':
                        'Enter the date the crime was reported to police and include a day, month and year'
                };
                const actual = formHelper.processErrors(error.errors);

                expect(actual).toMatchObject(expected);
            });

            it('Should return a list of correctly formatted errors given more than one', () => {
                const error = sectionDataWithManyNonRequiredErrors.body;
                const expected = {
                    'q-applicant-scottish-location': 'Location must be 60 characters or less',
                    'q-applicant-scottish-town-or-city':
                        'Town or city must be 60 characters or less'
                };
                const actual = formHelper.processErrors(error.errors);

                expect(actual).toMatchObject(expected);
            });
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
            const sectionName = 'p--check-your-answers';
            const expected = 'Agree and Submit';

            const actual = formHelper.getButtonText(sectionName);

            expect(actual).toMatch(expected);
        });

        it('Should return the default button text if nothing specific is specificed in the UISchema', () => {
            const sectionName = 'p-applicant-declaration';
            const expected = 'Continue';

            const actual = formHelper.getButtonText(sectionName);

            expect(actual).toMatch(expected);
        });
    });

    describe('Check is summary', () => {
        it('Should return true if a section has `isSummary: true` in the UISchema', () => {
            const sectionName = 'p--check-your-answers';

            const actual = formHelper.checkIsSummary(sectionName);

            expect(actual).toEqual(true);
        });

        it('Should return false if a section has no `isSummary` value in the UISchema', () => {
            const sectionName = 'p-applicant-declaration';

            const actual = formHelper.checkIsSummary(sectionName);

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

    describe('Get section HTML with errors', () => {
        it('Should return the section HTML with user error messages', () => {
            const sectionData = sectionDataWithErrors.body;
            const sectionId = 'p-applicant-british-citizen-or-eu-national';
            const csrfToken = 'YH7tcDzK-Q8ZfXG5bIZlM2xhN5-x8phJjJoI';

            const actual = formHelper.getSectionHtmlWithErrors(sectionData, sectionId, csrfToken);
            const expected =
                '<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"><li><a href="#q-applicant-british-citizen-or-eu-national">Select yes if you are a British citizen or EU national</a></li></ul></div>';

            expect(actual.replace(/\s+/g, '')).toMatch(expected.replace(/\s+/g, ''));
        });
    });

    describe('Get section HTML', () => {
        describe('Given a regular section with a single answer', () => {
            it('Should return the section HTML', () => {
                const sectionData = sectionDataValid.body;
                const allAnswers = {};
                const csrfToken = 'SrLylopP-JRn9c4qE_iFBzltrMT2XQDj2gqU';

                const actual = formHelper.getSectionHtml(sectionData, allAnswers, csrfToken);
                const expected =
                    '<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl"><h1 class="govuk-fieldset__heading">Are you 18 or over?</h1></legend>';

                expect(actual.replace(/\s+/g, '')).toMatch(expected.replace(/\s+/g, ''));
            });
        });
        describe('Given a page without a back button', () => {
            it('Should return the section HTML', () => {
                const sectionData = sectionDataConfirmation.body;
                const allAnswers = {};
                const csrfToken = 'SrLylopP-JRn9c4qE_iFBzltrMT2XQDj2gqU';

                const actual = formHelper.getSectionHtml(sectionData, allAnswers, csrfToken);
                const expected = 'class="govuk-back-link"';

                expect(actual.replace(/\s+/g, '')).not.toMatch(expected.replace(/\s+/g, ''));
            });
        });
        describe('Given a summary page with all answers', () => {
            it('Should return the summary HTML', () => {
                const sectionData = sectionDataValid.body;
                const allAnswers = {
                    body: {
                        data: {
                            'q-applicant-are-you-18-or-over': 'true',
                            'q-some-more-answers': 'cool'
                        }
                    }
                };
                const csrfToken = 'SrLylopP-JRn9c4qE_iFBzltrMT2XQDj2gqU';

                const actual = formHelper.getSectionHtml(sectionData, allAnswers, csrfToken);
                const expected =
                    '<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl"><h1 class="govuk-fieldset__heading">Are you 18 or over?</h1></legend>';

                expect(actual.replace(/\s+/g, '')).toMatch(expected.replace(/\s+/g, ''));
            });
        });
    });

    describe('Process Request', () => {
        it('Should remove unused hidden answers', () => {
            const rawBody = {
                'q-applicant-have-you-applied-for-or-received-any-other-compensation': 'true',
                'q-applicant-applied-for-other-compensation-briefly-explain-why-not': "Didn't know"
            };
            const section = 'applicant-have-you-applied-for-or-received-any-other-compensation';
            const actual = formHelper.processRequest(rawBody, section);

            expect(actual).toEqual({
                'q-applicant-have-you-applied-for-or-received-any-other-compensation': 'true'
            });
        });

        it('Should remove empty answers', () => {
            const rawBody = {
                'q-applicant-have-you-applied-to-us-before': 'true',
                'q-enter-your-previous-reference-number': ''
            };
            const section = 'applicant-have-you-applied-to-us-before';
            const actual = formHelper.processRequest(rawBody, section);

            expect(actual).toEqual({
                'q-applicant-have-you-applied-to-us-before': 'true'
            });
        });

        it('Should correct partial dates to ISO format', () => {
            const rawBody = {
                'q-applicant-when-did-the-crime-start': {
                    month: '05',
                    year: '1990'
                }
            };
            const section = 'applicant-when-did-the-crime-start';
            const actual = formHelper.processRequest(rawBody, section);

            expect(actual).toEqual({
                'q-applicant-when-did-the-crime-start': '1990-05-01T00:00:00.000Z'
            });
        });
    });
});
