'use strict';

const sectionbData = {
    data: [
        {
            type: 'progress-entries',
            id: 'p--check-your-answers',
            attributes: {
                sectionId: 'p--check-your-answers',
                url: null
            },
            relationships: {
                section: {
                    data: {
                        type: 'sections',
                        id: 'p--check-your-answers'
                    }
                }
            }
        }
    ],
    included: [
        {
            type: 'sections',
            id: 'p--check-your-answers',
            attributes: {
                type: 'object',
                $schema: 'http://json-schema.org/draft-07/schema#',
                properties: {
                    'p-check-your-answers': {
                        type: 'object',
                        title: 'Check your answers',
                        description: 'Check your answers before sending your application',
                        properties: {
                            summaryInfo: {
                                type: 'object',
                                lookup: {},
                                urlPath: 'apply',
                                editAnswerText: 'Change',
                                summaryStructure: [
                                    {
                                        type: 'theme',
                                        id: 'about-application',
                                        title: 'About your application',
                                        values: [
                                            {
                                                id: 'q--new-or-existing-application',
                                                type: 'simple',
                                                label: 'What would you like to do?',
                                                value: 'new',
                                                valueLabel: 'Start a new application',
                                                sectionId: 'p--new-or-existing-application',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q-applicant-fatal-claim',
                                                type: 'simple',
                                                label: 'Are you applying because someone died?',
                                                value: false,
                                                valueLabel: 'No',
                                                sectionId: 'p-applicant-fatal-claim',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q--was-the-crime-reported-to-police',
                                                type: 'simple',
                                                label: 'Was the crime reported to the police?',
                                                value: true,
                                                valueLabel: 'Yes',
                                                sectionId: 'p--was-the-crime-reported-to-police',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q-applicant-has-crime-reference-number',
                                                type: 'simple',
                                                label: 'Do you have a crime reference number?',
                                                value: true,
                                                valueLabel: 'Yes',
                                                sectionId: 'p-applicant-has-crime-reference-number',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q-applicant-who-are-you-applying-for',
                                                type: 'simple',
                                                label: 'Who are you applying for?',
                                                value: 'myself',
                                                valueLabel: 'Myself',
                                                sectionId: 'p-applicant-who-are-you-applying-for',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q-applicant-are-you-18-or-over',
                                                type: 'simple',
                                                label: 'Are you 18 or over?',
                                                value: true,
                                                valueLabel: 'Yes',
                                                sectionId: 'p-applicant-are-you-18-or-over',
                                                theme: 'about-application'
                                            },
                                            {
                                                id: 'q-applicant-british-citizen-or-eu-national',
                                                type: 'simple',
                                                label: 'Are you a British citizen or EU national?',
                                                value: true,
                                                valueLabel: 'Yes',
                                                sectionId:
                                                    'p-applicant-british-citizen-or-eu-national',
                                                theme: 'about-application'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                },
                additionalProperties: false
            },
            relationships: {
                answer: {
                    data: {
                        type: 'answers',
                        id: 'p--check-your-answers'
                    }
                }
            }
        },
        {
            type: 'answers',
            id: 'p--check-your-answers',
            attributes: {}
        }
    ],
    links: {
        prev:
            'http://localhost:3100/api/v1/questionnaires/95f6e8d3-fa7c-47a2-8229-56fce5d5fb2c/progress-entries?filter[sectionId]=p-applicant-provide-additional-information'
    },
    meta: {
        summary: [
            'p-applicant-declaration',
            'p-mainapplicant-declaration-under-12',
            'p-mainapplicant-declaration-12-and-over'
        ],
        confirmation: 'p--confirmation'
    }
};

module.exports = sectionbData;
