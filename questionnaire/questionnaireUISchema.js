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
                        autoComplete: 'bday'
                    }
                }
            }
        }
    },
    'p--check-your-answers': {
        options: {
            isSummary: true,
            buttonText: 'Agree and Submit',
            properties: {
                'p-check-your-answers': {
                    options: {
                        summaryStructure: [
                            {
                                title: 'Your details',
                                questions: {
                                    'p-applicant-enter-your-name': 'Name',

                                    'p-applicant-have-you-been-known-by-any-other-names':
                                        'Have you been known by any other names?',
                                    'p-applicant-what-other-names-have-you-used': 'Other names',
                                    'p-applicant-enter-your-date-of-birth': 'Date of birth',
                                    'p-applicant-enter-your-email-address': 'Email address',
                                    'p-applicant-enter-your-address': 'Address',
                                    'p-applicant-enter-your-telephone-number': 'Telephone Number',
                                    'p-applicant-confirmation-method': 'Confirmation method',
                                    'p-applicant-british-citizen-or-eu-national':
                                        'Are you a British citizen or EU National?',
                                    'p-applicant-are-you-18-or-over': 'Are you 18 or over?',

                                    'p-applicant-who-are-you-applying-for':
                                        'Who are you applying for?',
                                    'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse':
                                        'Were you a victim of sexual assault or abuse?',
                                    'p-applicant-select-the-option-that-applies-to-you':
                                        "Option you've selected"
                                }
                            },
                            {
                                title: 'About the crime',
                                questions: {
                                    'p-applicant-did-the-crime-happen-once-or-over-time':
                                        'Did the crime happen once or over a period of time?',
                                    'p-applicant-when-did-the-crime-happen':
                                        'When did the crime happen?',
                                    'p-applicant-when-did-the-crime-start':
                                        'When did the crime start?',
                                    'p-applicant-when-did-the-crime-stop':
                                        'When did the crime stop?',
                                    'p-applicant-select-reasons-for-the-delay-in-making-your-application':
                                        'Reasons for the delay in making your application',
                                    'p-applicant-where-did-the-crime-happen':
                                        'Where did the crime happen?',
                                    'p-applicant-where-in-england-did-it-happen':
                                        'Where in England did it happen?',
                                    'p-applicant-where-in-scotland-did-it-happen':
                                        'Where in Scotland did it happen?',
                                    'p-applicant-where-in-wales-did-it-happen':
                                        'Where in Wales did it happen?',
                                    'p-offender-do-you-know-the-name-of-the-offender':
                                        'Do you know the name of the offender?',
                                    'p-offender-enter-offenders-name': "Offender's name",

                                    'p-offender-describe-contact-with-offender':
                                        'Contact with offender'
                                }
                            },
                            {
                                title: 'Police report',
                                questions: {
                                    'p--was-the-crime-reported-to-police':
                                        'Was the crime reported to police?',
                                    'p--when-was-the-crime-reported-to-police':
                                        'When was the crime reported?',
                                    'p--whats-the-crime-reference-number': 'Crime reference number',
                                    'p--which-police-force-is-investigating-the-crime':
                                        'Which police force is investigating?',
                                    'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police':
                                        'Reasons for delay in reporting crime'
                                }
                            },
                            {
                                title: 'Other compensation',
                                questions: {
                                    'p-applicant-have-you-applied-to-us-before':
                                        'Have you applied before?',
                                    'p-applicant-have-you-applied-for-or-received-any-other-compensation':
                                        'Have you received other compensation?',
                                    'p-applicant-other-compensation-details':
                                        'Details of other compensation received'
                                }
                            }
                        ],
                        lookup: {
                            true: 'Yes',
                            false: 'No',
                            once: 'Once',
                            'over-a-period-of-time': 'Over a period of time',
                            'i-was-underage': 'I was under 18',
                            'i-was-advised-to-wait': 'I was advised to wait',
                            'medical-reasons': 'Medical reasons',
                            'other-reasons': 'Other reasons',
                            'i-was-under-18': 'I was under 18',
                            'unable-to-report-crime': 'Unable to report the crime',
                            other: 'Other reasons',
                            'option-1:-sexual-assault-or-abuse':
                                'Option 1: Sexual assault or abuse',
                            'option-2:-sexual-assault-or-abuse-and-other-injuries-or-losses':
                                'Option 2: Sexual assault or abuse and other injuries or losses',
                            myself: 'Myself',
                            'someone-else': 'Someone else',
                            england: 'England',
                            scotland: 'Scotland',
                            wales: 'Wales',
                            'somewhere-else': 'Somewhere else',
                            'i-have-no-contact-with-the-offender':
                                'I have no contact with the offender',
                            email: 'Email to ',
                            sms: 'Text message to',
                            10000033: 'Avon And Somerset Constabulary',
                            10000035: 'Bedfordshire Police',
                            10000001: 'British Transport Police',
                            10000039: 'Cambridgeshire Constabulary',
                            10000049: 'Cheshire Constabulary',
                            10000059: 'City Of London Police',
                            10000066: 'Cleveland Police',
                            10000082: 'Cumbria Constabulary',
                            10000084: 'Derbyshire Constabulary',
                            10000090: 'Devon & Cornwall Constabulary',
                            10000093: 'Dorset Police',
                            10000102: 'Durham Constabulary',
                            10000109: 'Dyfed Powys Police',
                            10000114: 'Essex Police',
                            10000128: 'Gloucestershire Constabulary',
                            10000140: 'Greater Manchester Police',
                            10000147: 'Gwent Constabulary',
                            10000150: 'Hampshire Constabulary',
                            10000153: 'Hertfordshire Constabulary',
                            10000169: 'Humberside Police',
                            10000172: 'Kent County Constabulary',
                            10000175: 'Lancashire Constabulary',
                            10000176: 'Leicestershire Police',
                            10000179: 'Lincolnshire Police',
                            10000181: 'Merseyside Police',
                            11809785: 'Metropolitan Barking',
                            11809719: 'Metropolitan Barnet',
                            11809788: 'Metropolitan Bexley',
                            11809722: 'Metropolitan Brent',
                            11809760: 'Metropolitan Bromley',
                            11809694: 'Metropolitan Camden',
                            11809713: 'Metropolitan Croydon',
                            11809743: 'Metropolitan Ealing',
                            11809783: 'Metropolitan Enfield',
                            11809709: 'Metropolitan Greenwich',
                            11809763: 'Metropolitan Hackney',
                            11809795: 'Metropolitan Hammersmith',
                            11809738: 'Metropolitan Haringey',
                            11809803: 'Metropolitan Harrow',
                            11809800: 'Metropolitan Havering',
                            11809775: 'Metropolitan Hillingdon',
                            11809780: 'Metropolitan Hounslow',
                            11809765: 'Metropolitan Islington',
                            11809801: 'Metropolitan Kensington',
                            11809865: 'Metropolitan Kingston',
                            11809693: 'Metropolitan Lambeth',
                            11809698: 'Metropolitan Lewisham',
                            11809861: 'Metropolitan Merton',
                            11809701: 'Metropolitan Newham',
                            11809782: 'Metropolitan Redbridge',
                            11809862: 'Metropolitan Richmond',
                            11809691: 'Metropolitan Southwark',
                            11809805: 'Metropolitan Sutton',
                            11809767: 'Metropolitan Tower Hamlets',
                            11809726: 'Metropolitan Waltham Forest',
                            11809771: 'Metropolitan Wandsworth',
                            11809683: 'Metropolitan Westminster',
                            10000185: 'Norfolk Constabulary',
                            10000187: 'North Wales Police',
                            10000189: 'North Yorkshire Police',
                            10000191: 'Northamptonshire Police',
                            10000195: 'Northumbria Police',
                            10000199: 'Nottinghamshire Police',
                            12607027: 'Scotland Argyll/West Dunbartonshire',
                            12157147: 'Scotland Ayrshire',
                            10000098: 'Scotland Dumfries & Galloway',
                            13400412: 'Scotland Edinburgh City',
                            10002424: 'Scotland Fife',
                            10000045: 'Scotland Forth Valley',
                            12607023: 'Scotland Greater Glasgow',
                            10000193: 'Scotland Highlands And Islands',
                            12607028: 'Scotland Lanarkshire',
                            13400413: 'Scotland Lothian And Borders',
                            10000133: 'Scotland North East',
                            12607026: 'Scotland Renfrewshire/Inverclyde',
                            10000243: 'Scotland Tayside',
                            10000215: 'South Wales Police',
                            10000218: 'South Yorkshire Police',
                            10000223: 'Staffordshire Police',
                            10000233: 'Suffolk Constabulary',
                            10000237: 'Surrey Constabulary',
                            10000240: 'Sussex Police',
                            10000247: 'Thames Valley Police',
                            10000274: 'Warwickshire Constabulary',
                            10000279: 'West Mercia Police',
                            10000285: 'West Midlands Police',
                            10000291: 'West Yorkshire Police',
                            10000295: 'Wiltshire Constabulary'
                        }
                    }
                }
            }
        }
    },
    'p-applicant-enter-your-address': {
        options: {
            properties: {
                'q-applicant-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        },
                        autoComplete: 'address-line1'
                    }
                },
                'q-applicant-building-and-street-2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        },
                        autoComplete: 'address-line1'
                    }
                },
                'q-applicant-town-or-city': {
                    options: {
                        autoComplete: 'address-level2'
                    }
                },
                'q-applicant-county': {
                    options: {
                        autoComplete: 'address-level1'
                    }
                },
                'q-applicant-postcode': {
                    options: {
                        autoComplete: 'postal-code'
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
            outputOrder: ['q-applicant-title', 'q-applicant-first-name', 'q-applicant-last-name'],
            properties: {
                'q-applicant-title': {
                    options: {
                        autoComplete: 'honorific-prefix'
                    }
                },
                'q-applicant-first-name': {
                    options: {
                        autoComplete: 'given-name'
                    }
                },
                'q-applicant-last-name': {
                    options: {
                        autoComplete: 'family-name'
                    }
                }
            }
        }
    },
    'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
        options: {
            outputOrder: [
                'q-applicant-select-reasons-for-the-delay-in-making-your-application',
                'q-applicant-explain-reason-for-delay-application'
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
    },
    'p--confirmation': {
        options: {
            showBackButton: false
        }
    },
    'p-applicant-you-cannot-get-compensation': {
        options: {
            buttonText: 'Continue anyway'
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
            outputOrder: ['q-police-force-id', 'list-of-police-forces']
        }
    },
    'p-applicant-enter-your-email-address': {
        options: {
            properties: {
                'q-applicant-enter-your-email-address': {
                    options: {
                        autocomplete: 'email',
                        attributes: {
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
                        autoComplete: 'tel'
                    }
                }
            }
        }
    },
    'p-applicant-confirmation-method': {
        options: {
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
                                itemValue: 'sms',
                                componentIds: ['q-applicant-enter-your-telephone-number']
                            }
                        ]
                    }
                },
                'q-applicant-enter-your-email-address': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                },
                'q-applicant-enter-your-telephone-number': {
                    options: {
                        macroOptions: {
                            classes: 'govuk-input--width-20'
                        }
                    }
                }
            }
        }
    }
};
