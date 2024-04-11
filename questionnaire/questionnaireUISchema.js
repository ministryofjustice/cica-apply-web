'use strict';

module.exports = {
    'p-applicant-fatal-claim': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--transition': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--was-the-crime-reported-to-police': {
        options: {
            outputOrder: ['q--was-the-crime-reported-to-police', 'dont-know-if-crime-reported'],
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-you-cannot-get-compensation': {
        options: {
            buttonText: 'Continue anyway',
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-has-crime-reference-number': {
        options: {
            outputOrder: ['q-applicant-has-crime-reference-number', 'crn-info'],
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-who-are-you-applying-for': {
        options: {
            signInLink: {
                visible: false
            },
            showBackButton: false
        }
    },
    'p-applicant-are-you-18-or-over': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-british-citizen-or-eu-national': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--context-applicant-details': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-confirmation-method': {
        options: {
            signInLink: {
                visible: false
            },
            transformOrder: [
                'q-applicant-enter-your-email-address',
                'q-applicant-enter-your-telephone-number',
                'q-applicant-confirmation-method'
            ],
            outputOrder: ['q-applicant-confirmation-method'],
            properties: {
                'q-applicant-confirmation-method': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'email',
                                componentIds: ['q-applicant-enter-your-email-address']
                            },
                            {
                                itemValue: 'text',
                                componentIds: ['q-applicant-enter-your-telephone-number']
                            }
                        ],
                        additionalMapping: [
                            {
                                itemType: 'divider',
                                itemValue: 'or',
                                itemIndex: 2
                            }
                        ]
                    }
                },
                'q-applicant-enter-your-email-address': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'email'
                        }
                    }
                },
                'q-applicant-enter-your-telephone-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'tel'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-enter-your-name': {
        options: {
            signInLink: {
                visible: false
            },
            outputOrder: ['q-applicant-title', 'q-applicant-first-name', 'q-applicant-last-name'],
            properties: {
                'q-applicant-title': {
                    options: {
                        macroOptions: {
                            autocomplete: 'honorific-prefix'
                        }
                    }
                },
                'q-applicant-first-name': {
                    options: {
                        macroOptions: {
                            autocomplete: 'given-name'
                        }
                    }
                },
                'q-applicant-last-name': {
                    options: {
                        macroOptions: {
                            autocomplete: 'family-name'
                        }
                    }
                }
            }
        }
    },
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
            outputOrder: ['q-applicant-when-did-the-crime-start']
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
            outputOrder: ['q-applicant-when-did-the-crime-stop']
        }
    },
    'p--check-your-answers': {
        options: {
            pageContext: 'summary'
        }
    },
    'p-applicant-enter-your-address': {
        options: {
            properties: {
                'q-applicant-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line1'
                        }
                    }
                },
                'q-applicant-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-applicant-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line3'
                        }
                    }
                },
                'q-applicant-town-or-city': {
                    options: {
                        macroOptions: {
                            autocomplete: 'address-level2'
                        }
                    }
                },
                'q-applicant-postcode': {
                    options: {
                        macroOptions: {
                            autocomplete: 'postal-code'
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-building-and-street',
                'q-applicant-building-and-street-2',
                'q-applicant-building-and-street-3',
                'q-applicant-town-or-city',
                'q-applicant-postcode'
            ]
        }
    },
    'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
        options: {
            outputOrder: [
                'q-applicant-explain-reason-for-delay-application',
                'help-reason-for-delay'
            ]
        }
    },
    'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
        options: {
            outputOrder: [
                'q-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police',
                'q-applicant-explain-reason-for-delay-reporting'
            ]
        }
    },
    'p-applicant-select-the-option-that-applies-to-you': {
        options: {
            outputOrder: ['applicant-your-choices', 'q-applicant-option'],
            properties: {
                'q-applicant-option': {
                    options: {
                        macroOptions: {
                            fieldset: {
                                legend: {
                                    classes: 'govuk-fieldset__legend--m'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    'p-applicant-when-did-the-crime-happen': {
        options: {
            outputOrder: ['q-applicant-when-did-the-crime-happen']
        }
    },
    'p-applicant-where-in-england-did-it-happen': {
        options: {
            outputOrder: [
                'q-applicant-english-town-or-city',
                'q-applicant-english-location',
                'additional-info-help-text'
            ]
        }
    },
    'p-applicant-where-in-wales-did-it-happen': {
        options: {
            outputOrder: [
                'q-applicant-welsh-town-or-city',
                'q-applicant-welsh-location',
                'additional-info-help-text'
            ]
        }
    },
    'p-applicant-where-in-scotland-did-it-happen': {
        options: {
            outputOrder: [
                'q-applicant-scottish-town-or-city',
                'q-applicant-scottish-location',
                'additional-info-help-text'
            ]
        }
    },
    'p--confirmation': {
        options: {
            pageContext: 'confirmation',
            showBackButton: false,
            signInLink: {
                visible: false
            }
        }
    },
    'p--which-police-force-is-investigating-the-crime': {
        options: {
            properties: {
                'q-police-force-id': {
                    options: {
                        defaultItem: {
                            value: '',
                            text: 'Select police force'
                        }
                    }
                }
            },
            outputOrder: ['q-police-force-id', 'additional-info-help-text']
        }
    },
    'p-applicant-enter-your-email-address': {
        options: {
            properties: {
                'q-applicant-enter-your-email-address': {
                    options: {
                        macroOptions: {
                            autocomplete: 'email',
                            spellcheck: 'false'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-enter-your-telephone-number': {
        options: {
            properties: {
                'q-applicant-enter-your-telephone-number': {
                    options: {
                        macroOptions: {
                            autocomplete: 'tel'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-declaration': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-applicant-declaration-deceased': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-mainapplicant-declaration-under-12': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-mainapplicant-declaration-under-12-deceased': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-mainapplicant-declaration-12-and-over-deceased': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-mainapplicant-declaration-12-and-over': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-rep-declaration-under-12': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-rep-declaration-12-and-over': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-rep-declaration-12-and-over-deceased': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-rep-declaration-under-12-deceased': {
        options: {
            buttonText: 'Agree and submit',
            pageContext: 'submission'
        }
    },
    'p-applicant-select-treatments': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-other-treatment-dmi',
                'q-applicant-select-treatments-dmi'
            ],
            outputOrder: ['q-applicant-select-treatments-dmi'],
            properties: {
                'q-applicant-select-treatments-dmi': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'other',
                                componentIds: ['q-applicant-other-treatment-dmi']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-gp-enter-your-address': {
        options: {
            properties: {
                'q-gp-organisation-name': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-gp-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-gp-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-gp-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-gp-organisation-name',
                'q-gp-building-and-street',
                'q-gp-building-and-street-2',
                'q-gp-building-and-street-3',
                'q-gp-town-or-city',
                'q-gp-postcode'
            ]
        }
    },
    'p--whats-the-crime-reference-number': {
        options: {
            outputOrder: ['q--whats-the-crime-reference-number', 'i-dont-know-the-crime-reference']
        }
    },
    'p-applicant-treatment-address': {
        options: {
            properties: {
                'q-applicant-treatment-organisation-name': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-treatment-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-treatment-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-treatment-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-treatment-organisation-name',
                'q-applicant-treatment-building-and-street',
                'q-applicant-treatment-building-and-street-2',
                'q-applicant-treatment-building-and-street-3',
                'q-applicant-treatment-town-or-city',
                'q-applicant-treatment-postcode'
            ]
        }
    },
    'p-applicant-work-details-option': {
        options: {
            transformOrder: ['q-applicant-work-details-other', 'q-applicant-work-details-option'],
            outputOrder: ['q-applicant-work-details-option'],
            properties: {
                'q-applicant-work-details-option': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'other',
                                componentIds: ['q-applicant-work-details-other']
                            }
                        ]
                    }
                },
                'q-applicant-work-details-other': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-head': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-head-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-head-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-face': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-face-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-face-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-neck': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-neck-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-neck-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-eye': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-eye-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-eye-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-ear': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-ear-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-ear-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-nose': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-nose-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-nose-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-mouth': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-mouth-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-mouth-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-skin': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-skin-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-skin-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-shoulder': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-shoulder-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-shoulder-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-chest': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-chest-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-chest-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-abdomen': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-abdomen-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-abdomen-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-back': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-back-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-back-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-pelvis': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-pelvis-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-pelvis-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-genitals': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-genitals-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-genitals-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-skin': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-skin-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-skin-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-shoulder': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-shoulder-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-shoulder-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-arm': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-arm-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-arm-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-elbow': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-elbow-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-elbow-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-wrist': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-wrist-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-wrist-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-hand': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-hand-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-hand-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-digit': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-digit-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-digit-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-skin': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-skin-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-skin-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-hip': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-hip-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-hip-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-leg': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-leg-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-leg-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-knee': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-knee-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-knee-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-ankle': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-ankle-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-ankle-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-foot': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-foot-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-foot-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-toes': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-toes-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-toes-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-upper-muscle': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-upper-muscle-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-upper-muscle-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-torso-muscle': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-torso-muscle-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-torso-muscle-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-arms-muscle': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-arms-muscle-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-arms-muscle-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-muscle': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-muscle-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-muscle-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-physical-injury-legs-skin': {
        // transformer: 'form',
        options: {
            transformOrder: [
                'q-applicant-physical-injuries-legs-skin-other',
                'q-applicant-physical-injuries'
            ],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-physical-injuries-legs-skin-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-dentist-address': {
        options: {
            properties: {
                'q-applicant-dentist-organisation-name': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-dentist-address-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-dentist-address-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-dentist-address-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-dentist-organisation-name',
                'q-applicant-dentist-address-building-and-street',
                'q-applicant-dentist-address-building-and-street-2',
                'q-applicant-dentist-address-building-and-street-3',
                'q-applicant-dentist-address-town-or-city',
                'q-applicant-dentist-address-postcode'
            ]
        }
    },
    'p-applicant-you-cannot-get-compensation-violent-crime': {
        options: {
            buttonText: 'Continue anyway'
        }
    },
    'p-applicant-where-did-the-crime-happen': {
        options: {
            outputOrder: ['q-applicant-where-did-the-crime-happen', 'additional-info-help-text']
        }
    },
    'p--when-was-the-crime-reported-to-police': {
        options: {
            outputOrder: ['q--when-was-the-crime-reported-to-police', 'additional-info-help-text']
        }
    },
    'p-offender-do-you-know-the-name-of-the-offender': {
        options: {
            outputOrder: [
                'q-offender-do-you-know-the-name-of-the-offender',
                'additional-info-help-text'
            ]
        }
    },
    'p-offender-enter-offenders-name': {
        options: {
            outputOrder: ['q-offender-enter-offenders-name', 'additional-info-help-text']
        }
    },
    'p-mainapplicant-confirmation-method': {
        options: {
            transformOrder: [
                'q-mainapplicant-enter-your-email-address',
                'q-mainapplicant-enter-your-telephone-number',
                'q-mainapplicant-confirmation-method'
            ],
            outputOrder: ['q-mainapplicant-confirmation-method'],
            properties: {
                'q-mainapplicant-confirmation-method': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'email',
                                componentIds: ['q-mainapplicant-enter-your-email-address']
                            },
                            {
                                itemValue: 'text',
                                componentIds: ['q-mainapplicant-enter-your-telephone-number']
                            }
                        ],
                        additionalMapping: [
                            {
                                itemType: 'divider',
                                itemValue: 'or',
                                itemIndex: 2
                            }
                        ]
                    }
                },
                'q-mainapplicant-enter-your-email-address': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'email'
                        }
                    }
                },
                'q-mainapplicant-enter-your-telephone-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'tel'
                        }
                    }
                }
            }
        }
    },
    'p-mainapplicant-enter-your-name': {
        options: {
            outputOrder: [
                'q-mainapplicant-title',
                'q-mainapplicant-first-name',
                'q-mainapplicant-last-name'
            ],
            properties: {
                'q-mainapplicant-title': {
                    options: {
                        macroOptions: {
                            autocomplete: 'honorific-prefix'
                        }
                    }
                },
                'q-mainapplicant-first-name': {
                    options: {
                        macroOptions: {
                            autocomplete: 'given-name'
                        }
                    }
                },
                'q-mainapplicant-last-name': {
                    options: {
                        macroOptions: {
                            autocomplete: 'family-name'
                        }
                    }
                }
            }
        }
    },
    'p-mainapplicant-enter-your-address': {
        options: {
            properties: {
                'q-mainapplicant-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line1'
                        }
                    }
                },
                'q-mainapplicant-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-mainapplicant-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-mainapplicant-town-or-city': {
                    options: {
                        macroOptions: {
                            autocomplete: 'address-level2'
                        }
                    }
                },
                'q-mainapplicant-postcode': {
                    options: {
                        macroOptions: {
                            autocomplete: 'postal-code'
                        }
                    }
                }
            },
            outputOrder: [
                'q-mainapplicant-building-and-street',
                'q-mainapplicant-building-and-street-2',
                'q-mainapplicant-building-and-street-3',
                'q-mainapplicant-town-or-city',
                'q-mainapplicant-postcode'
            ]
        }
    },
    'p-mainapplicant-parent': {
        options: {
            outputOrder: ['q-mainapplicant-parent', 'can-i-apply-for-child']
        }
    },
    'p-mainapplicant-shared-responsibility': {
        options: {
            outputOrder: [
                'q-mainapplicant-shared-responsibility',
                'mainapplicant-shared-responsibility'
            ]
        }
    },
    'p-mainapplicant-shared-responsibility-name': {
        options: {
            outputOrder: [
                'q-mainapplicant-shared-responsibility-name',
                'mainapplicant-shared-responsibility-name'
            ]
        }
    },
    'p-applicant-se-treatment': {
        options: {
            outputOrder: ['q-applicant-se-treatment', 'help-se-treatment']
        }
    },
    'p-applicant-se-equipment': {
        options: {
            outputOrder: ['q-applicant-se-equipment', 'help-se-equipment']
        }
    },
    'p-applicant-se-home-changes': {
        options: {
            outputOrder: ['q-applicant-se-home-changes', 'help-se-home-changes']
        }
    },
    'p-applicant-se-aids': {
        options: {
            outputOrder: ['q-applicant-se-aids', 'help-se-aids']
        }
    },
    'p-applicant-se-other': {
        options: {
            outputOrder: ['q-applicant-se-other', 'help-understanding-expenses']
        }
    },
    'p-applicant-unable-to-work-duration': {
        options: {
            outputOrder: ['q-applicant-unable-to-work-duration', 'details-work-duration']
        }
    },
    'p-applicant-select-infections': {
        options: {
            transformOrder: ['q-applicant-infections-other', 'q-applicant-physical-injuries'],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-infections-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-select-non-sa-infections': {
        options: {
            transformOrder: ['q-applicant-infections-other', 'q-applicant-physical-injuries'],
            outputOrder: ['q-applicant-physical-injuries'],
            properties: {
                'q-applicant-physical-injuries': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'phyinj-149',
                                componentIds: ['q-applicant-infections-other']
                            }
                        ]
                    }
                }
            }
        }
    },
    'p-applicant-future-work': {
        options: {
            outputOrder: ['q-applicant-future-work', 'help-future-work']
        }
    },
    'p-applicant-affect-future-duration': {
        options: {
            outputOrder: ['q-applicant-affect-future-duration', 'help-affect-future-duration']
        }
    },
    'p-applicant-affect-duration': {
        options: {
            outputOrder: ['q-applicant-affect-duration', 'help-affect-duration']
        }
    },
    'p-applicant-se-home-care': {
        options: {
            outputOrder: ['q-applicant-se-home-care', 'help-understanding-care']
        }
    },
    'p-rep-confirmation-method': {
        options: {
            transformOrder: [
                'q-rep-email-address',
                'q-rep-telephone-number',
                'q-rep-confirmation-method'
            ],
            outputOrder: ['q-rep-confirmation-method'],
            properties: {
                'q-rep-confirmation-method': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'email',
                                componentIds: ['q-rep-email-address']
                            },
                            {
                                itemValue: 'text',
                                componentIds: ['q-rep-telephone-number']
                            }
                        ],
                        additionalMapping: [
                            {
                                itemType: 'divider',
                                itemValue: 'or',
                                itemIndex: 2
                            }
                        ]
                    }
                },
                'q-rep-email-address': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'email'
                        }
                    }
                },
                'q-rep-telephone-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20',
                            autocomplete: 'tel'
                        }
                    }
                }
            }
        }
    },
    'p-rep-reference-number': {
        options: {
            transformOrder: ['q-rep-reference-number', 'q-rep-has-reference-number'],
            outputOrder: ['q-rep-has-reference-number'],
            properties: {
                'q-rep-has-reference-number': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: true,
                                componentIds: ['q-rep-reference-number']
                            }
                        ]
                    }
                },
                'q-rep-reference-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p--download-your-answers': {
        options: {
            buttonText: 'Continue to declaration'
        }
    },
    'p--has-legal-authority': {
        options: {
            outputOrder: ['q--has-legal-authority']
        }
    },
    'p--represents-legal-authority': {
        options: {
            outputOrder: ['q--represents-legal-authority']
        }
    },
    'p-rep-address': {
        options: {
            properties: {
                'q-rep-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line1'
                        }
                    }
                },
                'q-rep-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-rep-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line3'
                        }
                    }
                },
                'q-rep-town-or-city': {
                    options: {
                        macroOptions: {
                            autocomplete: 'address-level2'
                        }
                    }
                },
                'q-rep-postcode': {
                    options: {
                        macroOptions: {
                            autocomplete: 'postal-code'
                        }
                    }
                }
            },
            outputOrder: [
                'q-rep-building-and-street',
                'q-rep-building-and-street-2',
                'q-rep-building-and-street-3',
                'q-rep-town-or-city',
                'q-rep-postcode'
            ]
        }
    },
    'p-rep-organisation-address': {
        options: {
            properties: {
                'q-rep-organisation-name': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'organisation'
                        }
                    }
                },
                'q-rep-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line1'
                        }
                    }
                },
                'q-rep-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-rep-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line3'
                        }
                    }
                },
                'q-rep-town-or-city': {
                    options: {
                        macroOptions: {
                            autocomplete: 'address-level2'
                        }
                    }
                },
                'q-rep-postcode': {
                    options: {
                        macroOptions: {
                            autocomplete: 'postal-code'
                        }
                    }
                }
            },
            outputOrder: [
                'q-rep-organisation-name',
                'q-rep-building-and-street',
                'q-rep-building-and-street-2',
                'q-rep-building-and-street-3',
                'q-rep-town-or-city',
                'q-rep-postcode'
            ]
        }
    },
    'p-applicant-british-citizen-relative': {
        options: {
            outputOrder: ['q-applicant-british-citizen-relative', 'british-close-relative-info']
        }
    },
    'p-applicant-eu-citizen': {
        options: {
            outputOrder: ['q-applicant-eu-citizen', 'eu-citizen-info']
        }
    },
    'p-applicant-eu-citizen-relative': {
        options: {
            outputOrder: ['q-applicant-eu-citizen-relative', 'eu-citizen-relative-info']
        }
    },
    'p-applicant-eea-citizen': {
        options: {
            outputOrder: ['q-applicant-eea-citizen', 'eea-citizen-info']
        }
    },
    'p-applicant-eea-citizen-relative': {
        options: {
            outputOrder: ['q-applicant-eea-citizen-relative', 'eea-citizen-relative-info']
        }
    },
    'p-applicant-other-citizen': {
        options: {
            outputOrder: ['other-citizen-info', 'q-applicant-other-citizen'],
            properties: {
                'q-applicant-other-citizen': {
                    options: {
                        macroOptions: {
                            fieldset: {
                                legend: {
                                    classes: 'govuk-fieldset__legend--m'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    'p-applicant-relationship-to-deceased': {
        options: {
            transformOrder: [
                'q-applicant-relationship-other',
                'q-applicant-relationship-to-deceased'
            ],
            outputOrder: ['q-applicant-relationship-to-deceased'],
            properties: {
                'q-applicant-relationship-to-deceased': {
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: 'other',
                                componentIds: ['q-applicant-relationship-other']
                            }
                        ]
                    }
                },
                'q-applicant-relationship-other': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-armed-forces-relative': {
        options: {
            outputOrder: ['q-applicant-armed-forces-relative', 'armed-forces-relative-info']
        }
    },
    'p-applicant-funeral-costs-who-contributed': {
        options: {
            outputOrder: ['q-applicant-funeral-costs-who-contributed', 'funeral-costs-info']
        }
    },
    'p-applicant-claim-type': {
        options: {
            outputOrder: ['q-applicant-claim-type', 'applicant-claim-type-info'],
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-physical-help': {
        options: {
            outputOrder: ['q-applicant-physical-help', 'physical-help-info']
        }
    },
    'p-other-claimants': {
        options: {
            outputOrder: ['q-other-claimants', 'other-claimants-info']
        }
    },
    'p-applicant-immediate-aftermath': {
        options: {
            outputOrder: ['q-applicant-immediate-aftermath', 'immediate-aftermath-info']
        }
    },
    'p-applicant-disabling-mental-injury': {
        options: {
            outputOrder: ['q-applicant-disabling-mental-injury', 'disabling-mental-injury-info']
        }
    },
    'p-applicant-financial-help': {
        options: {
            outputOrder: ['q-applicant-financial-help', 'financial-help-info']
        }
    },
    'p-applicant-under-18': {
        options: {
            signInLink: {
                visible: false
            },
            outputOrder: ['applicant-under-18-info', 'q-applicant-under-18'],
            properties: {
                'q-applicant-under-18': {
                    options: {
                        macroOptions: {
                            fieldset: {
                                legend: {
                                    classes: 'govuk-fieldset__legend--m'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    'p-deceased-address': {
        options: {
            properties: {
                'q-deceased-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line1'
                        }
                    }
                },
                'q-deceased-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line2'
                        }
                    }
                },
                'q-deceased-building-and-street-3': {
                    options: {
                        macroOptions: {
                            classes: '',
                            autocomplete: 'address-line3'
                        }
                    }
                },
                'q-deceased-town-or-city': {
                    options: {
                        macroOptions: {
                            autocomplete: 'address-level2'
                        }
                    }
                },
                'q-deceased-postcode': {
                    options: {
                        macroOptions: {
                            autocomplete: 'postal-code'
                        }
                    }
                }
            }
        }
    },
    'p--context-crime-ref-no': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-what-do-you-want-to-do': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--transition-apply-when-18': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--transition-request-a-call-back': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--transition-contact-us': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p--transition-someone-18-or-over-to-apply': {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    'p-applicant-describe-incident': {
        options: {
            outputOrder: ['q-applicant-describe-incident'],
            properties: {
                'q-applicant-describe-incident': {
                    options: {
                        macroOptions: {
                            fieldset: {
                                legend: {
                                    classes: 'govuk-fieldset__legend--m'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
