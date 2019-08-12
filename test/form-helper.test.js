'use strict';

const formHelper = require('../questionnaire/form-helper');
const validTransformation = require('./test-fixtures/transformations/p-applicant-british-citizen-or-eu-national');
const validResolvedHtml = require('./test-fixtures/transformations/resolved html/p-applicant-british-citizen-or-eu-national');

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

        it('Should set partial dates to the first of the entered month', () => {
            let body = {'q-applicant-when-did-the-crime-start': {month: '05', year: '2018'}};

            const expected = {'q-applicant-when-did-the-crime-start': `2018-05-01T00:00:00.000Z`};

            Object.keys(body).forEach(property => {
                body = formHelper.correctPartialDates(body, property);
            });

            expect(body).toEqual(expected);
        });
    });

    describe('Get next section', () => {
        it('Should return the next secion name', () => {
            const nextSectionId = 'p-applicant-enter-your-name';
            const expected = 'applicant-enter-your-name';

            const actual = formHelper.getNextSection(nextSectionId);

            expect(actual).toEqual(expected);
        });

        it('Should return the overriding section name, if it is present and valid', () => {
            const nextSectionId = 'p-applicant-enter-your-name';
            const overridingId = 'p-applicant-enter-your-address';
            const expected = 'applicant-enter-your-address';

            const actual = formHelper.getNextSection(nextSectionId, overridingId);

            expect(actual).toEqual(expected);
        });
    });

    describe('Render page html', () => {
        it('Should return html given a valid transformation', () => {
            const transformation = validTransformation;
            const isFinal = false;
            const backTarget = '/apply/previous/applicant-british-citizen-or-eu-national';
            const isSummary = false;
            const expected = validResolvedHtml.replace(/\s+/g, '');

            const actual = formHelper
                .renderSection(transformation, isFinal, backTarget, isSummary)
                .replace(/\s+/g, '');

            expect(actual).toMatch(expected);
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
                'q-applicant-were-you-a-victim-of-sexual-assault-or-abuse': true
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
                'question-one': 'answer-one',
                'question-two': 'answer-two'
            };
            const actual = formHelper.processPreviousAnswers(answerObject, {});

            expect(actual).toMatchObject(expected);
        });
    });

    describe('In UI Schema', () => {
        it('Should return the sectionId given a section name which exists in the UISchema', () => {
            const sectionName = 'applicant-other-compensation-details';
            const expected = 'p-applicant-other-compensation-details';

            const actual = formHelper.inUiSchema(sectionName);

            expect(actual).toMatch(expected);
        });

        it('Should return the sectionId given a sectionId which exists in the UISchema', () => {
            const sectionName = 'p-applicant-other-compensation-details';
            const expected = 'p-applicant-other-compensation-details';

            const actual = formHelper.inUiSchema(sectionName);

            expect(actual).toMatch(expected);
        });

        it('Should return undefined given a section name which does not exist in the UISchema', () => {
            const sectionName = 'not-a-section';

            const actual = formHelper.inUiSchema(sectionName);

            expect(actual).toBeUndefined();
        });
    });
});
