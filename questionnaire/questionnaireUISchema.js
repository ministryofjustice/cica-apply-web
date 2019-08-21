'use strict';

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
            },
            outputOrder: [
                'q-applicant-when-did-the-crime-start',
                'i-dont-know-when-the-crime-started'
            ]
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
            },
            outputOrder: [
                'q-applicant-when-did-the-crime-stop',
                'i-dont-know-when-the-crime-stopped'
            ]
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
    },
    'p-applicant-enter-your-address': {
        options: {
            properties: {
                'q-applicant-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-building-and-street',
                'q-applicant-building-and-street-2',
                'q-applicant-town-or-city',
                'q-applicant-county',
                'q-applicant-postcode'
            ]
        }
    },
    'p--was-the-crime-reported-to-police': {
        options: {
            outputOrder: ['q--was-the-crime-reported-to-police', 'dont-know-if-crime-reported']
        }
    },
    'p-applicant-enter-your-name': {
        options: {
            outputOrder: ['q-applicant-title', 'q-applicant-first-name', 'q-applicant-last-name']
        }
    },
    'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
        options: {
            outputOrder: [
                'q-applicant-explain-reason-for-delay-application',
                'q-applicant-select-reasons-for-the-delay-in-making-your-application'
            ]
        }
    },
    'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
        options: {
            outputOrder: [
                'q-applicant-explain-reason-for-delay-reporting',
                'q-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police'
            ]
        }
    },
    'p-applicant-select-the-option-that-applies-to-you': {
        options: {
            outputOrder: ['applicant-your-choices', 'q-applicant-option']
        }
    },
    'p-applicant-when-did-the-crime-happen': {
        options: {
            outputOrder: ['q-applicant-when-did-the-crime-happen', 'when-did-the-crime-happen']
        }
    },
    'p-applicant-where-in-england-did-it-happen': {
        options: {
            outputOrder: ['q-applicant-english-town-or-city', 'q-applicant-english-location']
        }
    },
    'p-applicant-where-in-wales-did-it-happen': {
        options: {
            outputOrder: ['q-applicant-welsh-town-or-city', 'q-applicant-welsh-location']
        }
    },
    'p-applicant-where-in-scotland-did-it-happen': {
        options: {
            outputOrder: ['q-applicant-scottish-town-or-city', 'q-applicant-scottish-location']
        }
    },
    'p-offender-describe-contact-with-offender': {
        options: {
            outputOrder: [
                'q-offender-describe-contact-with-offender',
                'q-offender-i-have-no-contact-with-offender'
            ]
        }
    }
};
