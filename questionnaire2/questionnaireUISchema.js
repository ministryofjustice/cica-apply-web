module.exports = {
    'p-applicant-have-you-applied-to-us-before': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-enter-your-previous-reference-number',
                'q-applicant-have-you-applied-to-us-before'
            ],
            outputOrder: ['q-applicant-have-you-applied-to-us-before'],
            properties: {
                'q-applicant-have-you-applied-to-us-before': {
                    // transformer: 'govukRadios',
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: true,
                                componentIds: ['q-enter-your-previous-reference-number']
                            }
                        ]
                    }
                },
                'q-enter-your-previous-reference-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-have-you-applied-for-or-received-any-other-compensation': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-applied-for-other-compensation-briefly-explain-why-not',
                'q-applicant-have-you-applied-for-or-received-any-other-compensation'
            ],
            outputOrder: ['q-applicant-have-you-applied-for-or-received-any-other-compensation'],
            properties: {
                'q-applicant-have-you-applied-for-or-received-any-other-compensation': {
                    // transformer: 'govukRadios',
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: false,
                                componentIds: [
                                    'q-applicant-applied-for-other-compensation-briefly-explain-why-not'
                                ]
                            }
                        ]
                    }
                },
                'q-applicant-applied-for-other-compensation-briefly-explain-why-not': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-other-compensation-details': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-who-did-you-apply-to',
                'q-how-much-was-award',
                'q-when-will-you-find-out',
                'q-applicant-has-a-decision-been-made'
            ],
            outputOrder: [
                'q-applicant-who-did-you-apply-to',
                'q-applicant-has-a-decision-been-made'
            ],
            properties: {
                'q-applicant-has-a-decision-been-made': {
                    // transformer: 'govukRadios',
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: false,
                                componentIds: ['q-when-will-you-find-out']
                            },
                            {
                                itemValue: true,
                                componentIds: ['q-how-much-was-award']
                            }
                        ]
                    }
                },
                'q-how-much-was-award': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-10'
                        }
                    }
                },
                'q-when-will-you-find-out': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-when-did-the-crime-start': {
        options: {
            properties: {
                'q-applicant-when-did-the-crime-start': {
                    options: {
                        dateParts: {
                            day: false,
                            month: true,
                            year: true
                        }
                    }
                }
            }
        }
    },
    'p-applicant-when-did-the-crime-stop': {
        options: {
            properties: {
                'q-applicant-when-did-the-crime-stop': {
                    options: {
                        dateParts: {
                            day: false,
                            month: true,
                            year: true
                        }
                    }
                }
            }
        }
    },
    'p-applicant-enter-your-date-of-birth': {
        options: {
            properties: {
                'q-applicant-enter-your-date-of-birth': {
                    options: {
                        autoComplete: true
                    }
                }
            }
        }
    },
    'p--check-your-answers': {
        options: {
            isSummary: true
        }
    }
};
