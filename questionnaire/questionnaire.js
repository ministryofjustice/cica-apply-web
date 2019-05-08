module.exports = {
    uri: 'apply-for-compensation',
    sections: {
        'p-applicant-declaration': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Declaration',
            additionalProperties: false,
            properties: {
                'applicant-declaration': {
                    description:
                        '\n                <p class="govuk-body">By continuing you confirm that the information you will give is true as far as you know.</p>\n                {{ govukWarningText({\n                    text: "If you deliberately give false or misleading information, you may get less compensation or be prosecuted.",\n                    iconFallbackText: "Warning"\n                }) }}\n            '
                }
            }
        },
        'p-applicant-british-citizen-or-eu-national': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-british-citizen-or-eu-national'],
            additionalProperties: false,
            properties: {
                'q-applicant-british-citizen-or-eu-national': {
                    type: 'boolean',
                    title: 'Are you a British citizen or EU national?',
                    errorMessages: {
                        required: 'Select yes if you are a British citizen or EU national'
                    }
                }
            }
        },
        'p-applicant-are-you-18-or-over': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-are-you-18-or-over'],
            additionalProperties: false,
            properties: {
                'q-applicant-are-you-18-or-over': {
                    type: 'boolean',
                    title: 'Are you 18 or over?',
                    errorMessages: {
                        required: 'Select yes if you are over 18'
                    }
                }
            }
        },
        'p-applicant-who-are-you-applying-for': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-who-are-you-applying-for'],
            additionalProperties: false,
            properties: {
                'q-applicant-who-are-you-applying-for': {
                    title: 'Who are you applying for?',
                    type: 'string',
                    oneOf: [
                        {
                            title: 'Myself',
                            const: 'myself'
                        },
                        {
                            title: 'Someone else',
                            const: 'someone-else'
                        }
                    ],
                    errorMessages: {
                        required: 'Select Myself if you are the person applying for compensation'
                    }
                }
            }
        },
        'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-were-you-a-victim-of-sexual-assault-or-abuse'],
            additionalProperties: false,
            properties: {
                'q-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                    type: 'boolean',
                    title: 'Were you a victim of sexual assault or abuse?',
                    errorMessages: {
                        required: 'Select yes if you were a victim of sexual assault or abuse'
                    }
                }
            }
        },
        'p--before-you-continue': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'Before you continue',
            type: 'object',
            additionalProperties: false,
            properties: {
                'applicant-impact-on-you': {
                    description:
                        '\n                <p class="govuk-body">On the next page we will ask you to select an option based on how the crime affected you.</p>\n                <p class="govuk-body">We appreciate that this may be difficult for you.</p>\n                <h2 class="govuk-heading-m">If you need help or support</h2>\n                <p class="govuk-body">You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                <p class="govuk-body">Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                <p class="govuk-body">For practical or emotional support in England and Wales <a href="https://www.victimsinformationservice.org.uk/" target="_blank">visit the Victim and Witness Information</a> website.</p>\n                <p class="govuk-body">There is a different website if you live in <a href="https://www.mygov.scot/victim-witness-support/">Scotland</a>.</p>\n            '
                }
            }
        },
        'p-applicant-select-the-option-that-applies-to-you': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Select the option that applies to you',
            required: ['q-applicant-option'],
            additionalProperties: false,
            properties: {
                'applicant-your-choices': {
                    description:
                        '\n                <p class="govuk-body-l">We decide what enquiries to make depending on how the crime affected you.</p>\n                <h2 class="govuk-heading-m">Option 1: Sexual assault or abuse</h2>\n                <p class="govuk-body">Any compensation we pay acknowledges the emotional distress the crime caused you.</p>\n                <p class="govuk-body">We normally make a decision based on your application and the information we get from the police.</p>\n                <p class="govuk-body">We will usually make a decision within 4 months. This is because we do not normally need to see your medical records.</p>\n                <h2 class="govuk-heading-m">Option 2: Sexual assault or abuse and other injuries or losses</h2>\n                <p class="govuk-body">We can also pay compensation for:\n                <ul class="govuk-list govuk-list--bullet">\n                <li>lost earnings because you were unable to work</li>\n                <li>physical injuries</li>\n                <li>pregnancy, sexually transmitted disease or loss of foetus</li>\n                <li>disabling mental injuries that are additional to the emotional distress you already suffered</li>\n                </ul>\n                </p>\n                {{ govukDetails({\n                    summaryText: "What is a disabling mental injury?",\n                    text: "A disabling mental injury has a substantial adverse effect on your ability to carry out normal day-to-day activities. For example, reduced performance at school or work, or effects on your social or sexual relationships."\n                }) }}\n                <p class="govuk-body">We may ask a psychiatrist or clinical psychologist to confirm that you have a disabling mental injury if you do not already have a diagnosis.</p>\n                <p class="govuk-body">We will usually make a decision within 12 months. This is because we may need to examine your medical records, get medical reports and assess any losses.</p>\n                {{ govukDetails({\n                summaryText: "If you need help or support",\n                html: \'\n                    <p class="govuk-body">You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                    <p class="govuk-body">Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                    <p class="govuk-body">For practical or emotional support near you <a href="https://www.victimsinformationservice.org.uk/" target="_blank">visit the Victim and Witness Information</a> website.</p>\n                    <p class="govuk-body">There is a different website if you live in <a href="https://www.mygov.scot/victim-witness-support/">Scotland</a>.</p>\n                \'\n                }) }}\n            '
                },
                'q-applicant-option': {
                    title: 'Select the option that applies to you',
                    type: 'string',
                    oneOf: [
                        {
                            title: 'Option 1: Sexual assault or abuse',
                            const: 'option-1-sexual-assault-or-abuse'
                        },
                        {
                            title: 'Option 2: Sexual assault or abuse and other injuries or losses',
                            const: 'option-2-sexual-assault-or-abuse-and-other-injuries-ro-losses'
                        }
                    ],
                    errorMessages: {
                        required: 'Select either Option 1 or Option 2'
                    }
                }
            }
        },
        'p--was-the-crime-reported-to-police': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-was-the-crime-reported-to-police'],
            additionalProperties: false,
            properties: {
                'q-was-the-crime-reported-to-police': {
                    type: 'boolean',
                    title: 'Was the crime reported to the police?',
                    errorMessages: {
                        required: 'Select yes if the crime was reported to the police'
                    }
                },
                'dont-know-if-crime-reported': {
                    description:
                        '\n                {{ govukDetails({\n                summaryText: "I do not know if the crime was reported to the police",\n                html: \'<p>You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                        <p>Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                        <p>To get information about the crime you can <a href="https://www.police.uk/contact/101/" target="_blank">contact the Police</a></p>\'\n                }) }}\n            '
                }
            }
        },
        'p--when-was-the-crime-reported-to-police': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q--when-was-the-crime-reported-to-police'],
            additionalProperties: false,
            properties: {
                'q--when-was-the-crime-reported-to-police': {
                    type: 'string',
                    format: 'date-time',
                    title: 'When was the crime reported to the police?',
                    description: 'For example, 31 3 2018. You can enter an approximate date.',
                    errorMessages: {
                        required: 'Enter the date the crime was reported to the police',
                        format: 'The date the crime was reported to the police must be in the past'
                    }
                }
            }
        },
        'p--whats-the-crime-reference-number': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-whats-the-crime-reference-number'],
            additionalProperties: false,
            properties: {
                'q-whats-the-crime-reference-number': {
                    title: "What's the crime reference number?",
                    type: 'string',
                    description:
                        'This is the reference number the police gave the crime when it was reported.',
                    maxLength: 30,
                    errorMessages: {
                        required: 'Enter the crime reference number',
                        maxLength: 'Crime reference number must be 30 characters or less'
                    }
                }
            }
        },
        'p-applicant-did-the-crime-happen-once-or-over-time': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-did-the-crime-happen-once-or-over-time'],
            additionalProperties: false,
            properties: {
                'q-applicant-did-the-crime-happen-once-or-over-time': {
                    title: 'Did the crime happen once or over a period of time?',
                    type: 'string',
                    oneOf: [
                        {
                            title: 'Once',
                            const: 'once'
                        },
                        {
                            title: 'Over a period of time',
                            const: 'over-a-period-of-time'
                        }
                    ],
                    errorMessages: {
                        required: 'Select Once or Over a period of time'
                    }
                }
            }
        },
        'p-applicant-when-did-the-crime-happen': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-when-did-the-crime-happen'],
            additionalProperties: false,
            properties: {
                'q-applicant-when-did-the-crime-happen': {
                    type: 'string',
                    format: 'date-time',
                    title: 'When did the crime happen?',
                    description: 'For example, 31 3 2018. You can enter an approximate date.',
                    errorMessages: {
                        required:
                            'Enter the date the crime happened and include a day, month and year',
                        format: 'The date the crime happened must be in the past'
                    }
                },
                'when-did-the-crime-happen': {
                    description:
                        '\n                {{ govukDetails({\n                    summaryText: "I do not know when the crime happened",\n                    html: \'<p>You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                            <p>Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                            <p>To get information about the crime you can <a href="https://www.police.uk/contact/101/" target="_blank">contact the Police</a></p>\'\n                }) }}\n            '
                }
            }
        },
        'p-applicant-when-did-the-crime-start': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-when-did-the-crime-start'],
            additionalProperties: false,
            properties: {
                'q-applicant-when-did-the-crime-start': {
                    type: 'string',
                    format: 'date-time',
                    title: 'When did it start?',
                    description: 'For example, 03 2018. You can enter an approximate date.',
                    errorMessages: {
                        required: 'Enter the date the crime started and include a month and year',
                        format: 'Enter the date the crime started and include a month and year'
                    }
                },
                'i-dont-know-when-the-crime-started': {
                    description:
                        '\n                {% from "components/details/macro.njk" import govukDetails %}\n                {{ govukDetails({\n                    summaryText: "I do not know when the crime started",\n                    html: \'<p>You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                            <p>Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                            <p>To get information about the crime you can <a href="https://www.police.uk/contact/101/" target="_blank">contact the Police</a></p>\'\n                }) }}\n            '
                }
            }
        },
        'p-applicant-when-did-the-crime-stop': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-when-did-the-crime-stop'],
            additionalProperties: false,
            properties: {
                'q-applicant-when-did-the-crime-stop': {
                    type: 'string',
                    format: 'date-time',
                    title: 'When did it stop?',
                    description: 'For example, 31 3 2018. You can enter an approximate date.',
                    errorMessages: {
                        required: 'Enter the date the crime stopped and include a month and year',
                        format: 'Enter the date the crime stopped and include a month and year'
                    }
                },
                'i-dont-know-when-the-crime-stopped': {
                    description:
                        '\n                {% from "components/details/macro.njk" import govukDetails %}\n                {{ govukDetails({\n                    summaryText: "I do not know when the crime stopped",\n                    html: \'<p>You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                            <p>Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                            <p>To get information about the crime you can <a href="https://www.police.uk/contact/101/" target="_blank">contact the Police</a></p>\'\n                }) }}\n            '
                }
            }
        },
        'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: [
                'q-applicant-reason-for-delay-in-application',
                'q-applicant-select-reasons-for-the-delay-in-making-your-application'
            ],
            additionalProperties: false,
            properties: {
                'q-applicant-reason-for-delay-in-application': {
                    title: 'Select reasons for the delay in making your application',
                    type: 'array',
                    maxItems: 4,
                    uniqueItems: true,
                    items: {
                        anyOf: [
                            {
                                title: 'I was under 18',
                                const: 'i-was-underage'
                            },
                            {
                                title: 'I was advised to wait',
                                const: 'i-was-advised-to-wait'
                            },
                            {
                                title: 'Medical reasons',
                                const: 'medical-reasons'
                            },
                            {
                                title: 'Other reasons',
                                const: 'other-reasons'
                            }
                        ]
                    },
                    errorMessages: {
                        required:
                            'Select if you were under 18, advised to wait, medical reasons or other reasons'
                    }
                },
                'q-applicant-select-reasons-for-the-delay-in-making-your-application': {
                    title: 'Briefly explain these reasons',
                    type: 'string',
                    maxLength: 500,
                    errorMessages: {
                        required: 'Explain the reasons for the delay in making your application',
                        maxLength: 'Explanation must be 500 characters or less'
                    }
                }
            }
        },
        'p-applicant-where-did-the-crime-happen': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-where-did-the-crime-happen'],
            additionalProperties: false,
            properties: {
                'q-applicant-where-did-the-crime-happen': {
                    title: 'Where did the crime happen?',
                    type: 'string',
                    oneOf: [
                        {
                            title: 'England',
                            const: 'england'
                        },
                        {
                            title: 'Scotland',
                            const: 'scotland'
                        },
                        {
                            title: 'Wales',
                            const: 'wales'
                        },
                        {
                            title: 'Somewhere else',
                            const: 'somewhere-else'
                        }
                    ],
                    errorMessages: {
                        required: 'Select England, Scotland, Wales or Somewhere else'
                    }
                }
            }
        },
        'p-applicant-where-in-england-did-it-happen': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Where in England did it happen?',
            required: ['q-applicant-english-town-or-city', 'q-applicant-english-location'],
            additionalProperties: false,
            properties: {
                'q-applicant-english-town-or-city': {
                    type: 'string',
                    title: 'Town or city',
                    maxLength: 60,
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened',
                        maxLength: 'Town or city must be 60 characters or less'
                    }
                },
                'q-applicant-english-location': {
                    type: 'string',
                    title: 'Location',
                    description:
                        'For example, the name of a street, business, building or nearby local landmark. You can enter more than one.',
                    maxLength: 60,
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark',
                        maxLength: 'Location must be 60 characters or less'
                    }
                }
            }
        },
        'p-applicant-where-in-scotland-did-it-happen': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Where in Scotland did it happen?',
            required: ['q-applicant-scottish-town-or-city', 'q-applicant-scottish-location'],
            additionalProperties: false,
            properties: {
                'q-applicant-scottish-town-or-city': {
                    type: 'string',
                    title: 'Town or city',
                    maxLength: 60,
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened',
                        maxLength: 'Town or city must be 60 characters or less'
                    }
                },
                'q-applicant-scottish-location': {
                    type: 'string',
                    title: 'Location',
                    description:
                        'For example, the name of a street, business, building or nearby local landmark. You can enter more than one.',
                    maxLength: 60,
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark',
                        maxLength: 'Location must be 60 characters or less'
                    }
                }
            }
        },
        'p-applicant-where-in-wales-did-it-happen': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Where in Wales did it happen?',
            required: ['q-applicant-welsh-town-or-city', 'q-applicant-welsh-location'],
            additionalProperties: false,
            properties: {
                'q-applicant-welsh-town-or-city': {
                    type: 'string',
                    title: 'Town or city',
                    maxLength: 60,
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened',
                        maxLength: 'Town or city must be 60 characters or less'
                    }
                },
                'q-applicant-welsh-location': {
                    type: 'string',
                    title: 'Location',
                    description:
                        'For example, the name of a street, business, building or nearby local landmark. You can enter more than one.',
                    maxLength: 60,
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark',
                        maxLength: 'Location must be 60 characters or less'
                    }
                }
            }
        },
        'p--you-need-to-contact-us': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'You need to contact us',
            type: 'object',
            additionalProperties: false,
            properties: {
                'you-need-to-ccontact-us': {
                    description:
                        '\n                <p class="govuk-body-l">You need to contact us to proceed with your application</p>\n                <p class="govuk-body">You may continue your application, but any future application for the same injuries will be refused.</p>\n            '
                }
            }
        },
        'p--which-english-police-force-is-investigating-the-crime': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'Which English police force is investigating the crime?',
            type: 'object',
            required: ['q--which-english-police-force-is-investigating-the-crime'],
            additionalProperties: false,
            properties: {
                'q--which-english-police-force-is-investigating-the-crime': {
                    type: 'integer',
                    oneOf: [
                        {
                            title: 'Avon And Somerset Constabulary',
                            const: 10000033
                        },
                        {
                            title: 'Bedfordshire Police',
                            const: 10000035
                        },
                        {
                            title: 'British Transport Police',
                            const: 10000001
                        },
                        {
                            title: 'Cambridgeshire Constabulary',
                            const: 10000039
                        },
                        {
                            title: 'Cheshire Constabulary',
                            const: 10000049
                        },
                        {
                            title: 'City Of London Police',
                            const: 10000059
                        },
                        {
                            title: 'Cleveland Police',
                            const: 10000066
                        },
                        {
                            title: 'Cumbria Constabulary',
                            const: 10000082
                        },
                        {
                            title: 'Derbyshire Constabulary',
                            const: 10000084
                        },
                        {
                            title: 'Devon and Cornwall Police',
                            const: 10000090
                        },
                        {
                            title: 'Dorset Police',
                            const: 10000093
                        },
                        {
                            title: 'Durham Constabulary',
                            const: 10000102
                        },
                        {
                            title: 'Essex Police',
                            const: 10000114
                        },
                        {
                            title: 'Gloucestershire Constabulary',
                            const: 10000128
                        },
                        {
                            title: 'Greater Manchester Police',
                            const: 10000140
                        },
                        {
                            title: 'Hampshire Constabulary',
                            const: 10000150
                        },
                        {
                            title: 'Hertfordshire Constabulary',
                            const: 10000153
                        },
                        {
                            title: 'Humberside Police',
                            const: 10000169
                        },
                        {
                            title: 'Kent Police',
                            const: 10000172
                        },
                        {
                            title: 'Lancashire Constabulary',
                            const: 10000175
                        },
                        {
                            title: 'Leicestershire Police',
                            const: 10000176
                        },
                        {
                            title: 'Lincolnshire Police',
                            const: 10000179
                        },
                        {
                            title: 'Merseyside Police',
                            const: 10000181
                        },
                        {
                            title: 'Metropolitan Barking',
                            const: 11809785
                        },
                        {
                            title: 'Metropolitan Barnet',
                            const: 11809719
                        },
                        {
                            title: 'Metropolitan Bexley',
                            const: 11809788
                        },
                        {
                            title: 'Metropolitan Brent',
                            const: 11809722
                        },
                        {
                            title: 'Metropolitan Bromley',
                            const: 11809760
                        },
                        {
                            title: 'Metropolitan Camden',
                            const: 11809694
                        },
                        {
                            title: 'Metropolitan Croydon',
                            const: 11809713
                        },
                        {
                            title: 'Metropolitan Ealing',
                            const: 11809743
                        },
                        {
                            title: 'Metropolitan Enfield',
                            const: 11809783
                        },
                        {
                            title: 'Metropolitan Greenwich',
                            const: 11809709
                        },
                        {
                            title: 'Metropolitan Hackney',
                            const: 11809763
                        },
                        {
                            title: 'Metropolitan Hammersmith',
                            const: 11809795
                        },
                        {
                            title: 'Metropolitan Haringey',
                            const: 11809738
                        },
                        {
                            title: 'Metropolitan Harrow',
                            const: 11809803
                        },
                        {
                            title: 'Metropolitan Havering',
                            const: 11809800
                        },
                        {
                            title: 'Metropolitan Hillingdon',
                            const: 11809775
                        },
                        {
                            title: 'Metropolitan Hounslow',
                            const: 11809780
                        },
                        {
                            title: 'Metropolitan Islington',
                            const: 11809765
                        },
                        {
                            title: 'Metropolitan Kensington',
                            const: 11809801
                        },
                        {
                            title: 'Metropolitan Kingston',
                            const: 11809865
                        },
                        {
                            title: 'Metropolitan Lambeth',
                            const: 11809693
                        },
                        {
                            title: 'Metropolitan Lewisham',
                            const: 11809698
                        },
                        {
                            title: 'Metropolitan Merton',
                            const: 11809861
                        },
                        {
                            title: 'Metropolitan Newham',
                            const: 11809701
                        },
                        {
                            title: 'Metropolitan Redbridge',
                            const: 11809782
                        },
                        {
                            title: 'Metropolitan Richmond',
                            const: 11809862
                        },
                        {
                            title: 'Metropolitan Southwark',
                            const: 11809691
                        },
                        {
                            title: 'Metropolitan Sutton',
                            const: 11809805
                        },
                        {
                            title: 'Metropolitan Tower Hamlets',
                            const: 11809767
                        },
                        {
                            title: 'Metropolitan Waltham Forest',
                            const: 11809726
                        },
                        {
                            title: 'Metropolitan Wandsworth',
                            const: 11809771
                        },
                        {
                            title: 'Metropolitan Westminster',
                            const: 11809683
                        },
                        {
                            title: 'Norfolk Constabulary',
                            const: 10000185
                        },
                        {
                            title: 'North Yorkshire Police',
                            const: 10000189
                        },
                        {
                            title: 'Northamptonshire Police',
                            const: 10000191
                        },
                        {
                            title: 'Northumbria Police',
                            const: 10000195
                        },
                        {
                            title: 'Nottinghamshire Police',
                            const: 10000199
                        },
                        {
                            title: 'South Yorkshire Police',
                            const: 10000218
                        },
                        {
                            title: 'Staffordshire Police',
                            const: 10000223
                        },
                        {
                            title: 'Suffolk Constabulary',
                            const: 10000233
                        },
                        {
                            title: 'Surrey Police',
                            const: 10000237
                        },
                        {
                            title: 'Sussex Police',
                            const: 10000240
                        },
                        {
                            title: 'Thames Valley Police',
                            const: 10000247
                        },
                        {
                            title: 'Warwickshire Police',
                            const: 10000274
                        },
                        {
                            title: 'West Mercia Police',
                            const: 10000279
                        },
                        {
                            title: 'West Midlands Police',
                            const: 10000285
                        },
                        {
                            title: 'West Yorkshire Police',
                            const: 10000291
                        },
                        {
                            title: 'Wiltshire Police',
                            const: 10000295
                        }
                    ],
                    errorMessages: {
                        required: 'Select a police force from the list'
                    }
                }
            }
        },
        'p--which-police-scotland-division-is-investigating-the-crime': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'What police force is dealing with the crime?',
            type: 'object',
            required: ['q--which-scottish-police-force-is-investigating-the-crime'],
            additionalProperties: false,
            properties: {
                'q--which-scottish-police-force-is-investigating-the-crime': {
                    type: 'integer',
                    oneOf: [
                        {
                            title: 'Argyll and West Dunbartonshire',
                            const: 12607027
                        },
                        {
                            title: 'Ayrshire',
                            const: 12157147
                        },
                        {
                            title: 'British Transport Police',
                            const: 10000001
                        },
                        {
                            title: 'Dumfries and Galloway',
                            const: 10000098
                        },
                        {
                            title: 'Edinburgh',
                            const: 13400412
                        },
                        {
                            title: 'Fife',
                            const: 10002424
                        },
                        {
                            title: 'Forth Valley',
                            const: 10000045
                        },
                        {
                            title: 'Greater Glasgow',
                            const: 12607023
                        },
                        {
                            title: 'Highland and Islands',
                            const: 10000193
                        },
                        {
                            title: 'Lanarkshire',
                            const: 12607028
                        },
                        {
                            title: 'North East',
                            const: 10000133
                        },
                        {
                            title: 'Renfrewshire and Inverclyde',
                            const: 12607026
                        },
                        {
                            title: 'Tayside',
                            const: 10000243
                        },
                        {
                            title: 'The Lothians and Scottish Borders',
                            const: 13400413
                        }
                    ],
                    errorMessages: {
                        required: 'Select a Police Scotland division '
                    }
                }
            }
        },
        'p--which-welsh-police-force-is-investigating-the-crime': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'What police force is dealing with the crime?',
            type: 'object',
            required: ['q--which-welsh-police-force-is-investigating-the-crime'],
            additionalProperties: false,
            properties: {
                'q--which-welsh-police-force-is-investigating-the-crime': {
                    type: 'integer',
                    oneOf: [
                        {
                            title: 'British Transport Police',
                            const: 10000001
                        },
                        {
                            title: 'Dyfed-Powys',
                            const: 10000109
                        },
                        {
                            title: 'Gwent',
                            const: 10000147
                        },
                        {
                            title: 'North Wales',
                            const: 10000187
                        },
                        {
                            title: 'South Wales',
                            const: 10000215
                        }
                    ],
                    errorMessages: {
                        required: 'Select a police force'
                    }
                }
            }
        },
        'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: [
                'q-applicant-reason-for-delay-in-reporting-crime',
                'q-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police'
            ],
            additionalProperties: false,
            properties: {
                'q-applicant-reason-for-delay-in-reporting-crime': {
                    title: 'Select reasons for the delay in reporting the crime to the police',
                    type: 'array',
                    maxItems: 3,
                    uniqueItems: true,
                    items: {
                        anyOf: [
                            {
                                title: 'I was under 18',
                                const: 'i-was-under-18'
                            },
                            {
                                title: 'Unable to report the crime',
                                const: 'unable-to-report-crime'
                            },
                            {
                                title: 'Other reasons',
                                const: 'other'
                            }
                        ]
                    },
                    errorMessages: {
                        required:
                            'Select if you were under 18, unable to report the crime or other reasons'
                    }
                },
                'q-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
                    title: 'Briefly explain these reasons',
                    type: 'string',
                    maxLength: 500,
                    errorMessages: {
                        required:
                            'Explain the reasons for the delay in reporting the crime to the police',
                        maxLength: 'Explanation must be 500 characters or less'
                    }
                }
            }
        },
        'p-offender-do-you-know-the-name-of-the-offender': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-offender-do-you-know-the-name-of-the-offender'],
            additionalProperties: false,
            properties: {
                'q-offender-do-you-know-the-name-of-the-offender': {
                    type: 'boolean',
                    title: 'Do you know the name of the offender?',
                    errorMessages: {
                        required: "Select yes if you know the offender's name"
                    }
                }
            }
        },
        'p-offender-enter-offenders-name': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: "Enter the offender's name",
            required: ['q-offenders-name'],
            additionalProperties: false,
            properties: {
                'q-offenders-name': {
                    type: 'string',
                    description: 'We will not contact the offender.',
                    maxLength: 120,
                    errorMessages: {
                        required: "Enter the offender's name",
                        maxLength: "Offender's name must be 120 characters or less"
                    }
                }
            }
        },
        'p-offender-describe-contact-with-offender': {
            type: 'object',
            properties: {
                'q-offender-contact-description': {
                    type: 'string',
                    title: 'If you have contact with the offender, describe it below',
                    description:
                        'We will not pay compensation if the offender may benefit from it.',
                    maxLength: 500,
                    errorMessages: {
                        required: 'Enter details of any contact you have with the offender',
                        maxLength: 'Description must be 500 characters or less'
                    }
                },
                'q-offender-no-contact-with-offender': {
                    type: 'array',
                    maxItems: 1,
                    uniqueItems: true,
                    items: {
                        anyOf: [
                            {
                                title: 'I have no contact with the offender',
                                const: 'none'
                            }
                        ]
                    }
                }
            },
            allOf: [
                {
                    $ref:
                        '#/definitions/if-not-checked-then-q-offender-contact-description-is-required'
                }
            ],
            definitions: {
                'if-not-checked-then-q-offender-contact-description-is-required': {
                    if: {
                        not: {
                            required: ['q-offender-no-contact-with-offender']
                        }
                    },
                    then: {
                        required: ['q-offender-contact-description']
                    }
                }
            }
        },
        'p-applicant-have-you-applied-to-us-before': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            propertyNames: {
                enum: [
                    'q-applicant-have-you-applied-to-us-before',
                    'q-enter-your-previous-reference-number'
                ]
            },
            properties: {
                'q-applicant-have-you-applied-to-us-before': {
                    title: 'Have you applied to us before?',
                    type: 'boolean',
                    errorMessages: {
                        required: 'Select yes if you have applied to us before'
                    }
                },
                'q-enter-your-previous-reference-number': {
                    type: 'string',
                    title: 'Enter your previous reference number if you know it (optional)',
                    maxLength: 50,
                    errorMessages: {
                        MaxLength: 'Previous reference number must be 50 characters or less'
                    }
                }
            },
            required: ['q-applicant-have-you-applied-to-us-before'],
            allOf: [
                {
                    $ref:
                        '#/definitions/if-true-then-q-enter-your-previous-reference-number-is-required'
                }
            ],
            definitions: {
                'if-true-then-q-enter-your-previous-reference-number-is-required': {
                    if: {
                        properties: {
                            'q-applicant-have-you-applied-to-us-before': {
                                const: true
                            }
                        }
                    },
                    then: {
                        propertyNames: {
                            enum: [
                                'q-applicant-have-you-applied-to-us-before',
                                'q-enter-your-previous-reference-number'
                            ]
                        }
                    }
                }
            }
        },
        'p-applicant-have-you-applied-for-or-received-any-other-compensation': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            propertyNames: {
                enum: [
                    'q-applicant-have-you-applied-for-or-received-any-other-compensation',
                    'q-applicant-applied-for-other-compensation-briefly-explain-why-not'
                ]
            },
            properties: {
                'q-applicant-have-you-applied-for-or-received-any-other-compensation': {
                    title: 'Have you applied for or received any other form of compensation?',
                    description:
                        'For example, if you claimed insurance, sought civil damages, or a court decided you should get compensation.',
                    type: 'boolean',
                    errorMessages: {
                        required:
                            'Select yes if you have applied for or received another form of compensation'
                    }
                },
                'q-applicant-applied-for-other-compensation-briefly-explain-why-not': {
                    type: 'string',
                    title: 'Briefly explain why not.',
                    maxLength: 500,
                    errorMessages: {
                        required:
                            'Explain why you did not apply for or receive any other form of compensation',
                        maxLength: 'Explanation must be 500 characters or less'
                    }
                }
            },
            required: ['q-applicant-have-you-applied-for-or-received-any-other-compensation'],
            allOf: [
                {
                    $ref:
                        '#/definitions/if-false-then-q-applicant-applied-for-other-compensation-briefly-explain-why-not-is-required'
                }
            ],
            definitions: {
                'if-false-then-q-applicant-applied-for-other-compensation-briefly-explain-why-not-is-required': {
                    if: {
                        properties: {
                            'q-applicant-have-you-applied-for-or-received-any-other-compensation': {
                                const: false
                            }
                        }
                    },
                    then: {
                        required: [
                            'q-applicant-applied-for-other-compensation-briefly-explain-why-not'
                        ],
                        propertyNames: {
                            enum: [
                                'q-applicant-have-you-applied-for-or-received-any-other-compensation',
                                'q-applicant-applied-for-other-compensation-briefly-explain-why-not'
                            ]
                        }
                    }
                }
            }
        },
        'p-applicant-other-compensation-details': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Other compensation',
            propertyNames: {
                enum: [
                    'q-applicant-who-did-you-apply-to',
                    'q-applicant-has-a-decision-been-made',
                    'q-how-much-was-award',
                    'q-when-will-you-find-out'
                ]
            },
            properties: {
                'q-applicant-who-did-you-apply-to': {
                    type: 'string',
                    title: 'Who have you applied to or received compensation from?',
                    maxLength: 50,
                    errorMessages: {
                        required: 'Enter who you applied to or received compensation from',
                        maxLength:
                            'Who you applied to or received compensation from must be 50 characters or less'
                    }
                },
                'q-applicant-has-a-decision-been-made': {
                    title: 'Have they made a decision?',
                    type: 'boolean',
                    errorMessages: {
                        required:
                            'Select yes if you have received a decision about the other compensation claim'
                    }
                },
                'q-how-much-was-award': {
                    type: 'string',
                    title: 'How much was the award?',
                    maxLength: 50,
                    errorMessages: {
                        required: 'Enter an amount',
                        maxLength: 'Award amount must be 50 characters or less'
                    }
                },
                'q-when-will-you-find-out': {
                    type: 'string',
                    title: 'When will you find out?',
                    description:
                        'Enter an approximate date, for example, December 2019. If you do not know you can say so.',
                    maxLength: 50,
                    errorMessages: {
                        required: 'Enter an approximate date',
                        maxLength: 'When will you find out must be 50 characters or less'
                    }
                }
            },
            required: ['q-applicant-who-did-you-apply-to', 'q-applicant-has-a-decision-been-made'],
            allOf: [
                {
                    $ref: '#/definitions/if-false-then-q-when-will-you-find-out-is-required'
                },
                {
                    $ref: '#/definitions/if-true-then-q-how-much-was-award-is-required'
                }
            ],
            definitions: {
                'if-false-then-q-when-will-you-find-out-is-required': {
                    if: {
                        properties: {
                            'q-applicant-has-a-decision-been-made': {
                                const: false
                            }
                        }
                    },
                    then: {
                        required: ['q-when-will-you-find-out'],
                        propertyNames: {
                            enum: [
                                'q-applicant-who-did-you-apply-to',
                                'q-applicant-has-a-decision-been-made',
                                'q-when-will-you-find-out'
                            ]
                        }
                    }
                },
                'if-true-then-q-how-much-was-award-is-required': {
                    if: {
                        properties: {
                            'q-applicant-has-a-decision-been-made': {
                                const: true
                            }
                        }
                    },
                    then: {
                        required: ['q-how-much-was-award'],
                        propertyNames: {
                            enum: [
                                'q-applicant-who-did-you-apply-to',
                                'q-applicant-has-a-decision-been-made',
                                'q-how-much-was-award'
                            ]
                        }
                    }
                }
            }
        },
        'p-applicant-enter-your-name': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'Enter your name',
            type: 'object',
            required: [
                'q-applicant-name-title',
                'q-applicant-name-firstname',
                'q-applicant-name-lastname'
            ],
            additionalProperties: false,
            properties: {
                'q-applicant-name-title': {
                    title: 'Title',
                    type: 'string',
                    maxLength: 6,
                    errorMessages: {
                        required: 'Enter your title',
                        maxLength: 'Title must be 6 characters or less'
                    }
                },
                'q-applicant-name-firstname': {
                    title: 'First name',
                    type: 'string',
                    maxLength: 70,
                    errorMessages: {
                        required: 'Enter your first name',
                        maxLength: 'First name must be 70 characters or less'
                    }
                },
                'q-applicant-name-lastname': {
                    title: 'Last name',
                    type: 'string',
                    maxLength: 70,
                    errorMessages: {
                        required: 'Enter your last name',
                        maxLength: 'Last name must be 70 characters or less'
                    }
                }
            }
        },
        'p-applicant-have-you-been-known-by-any-other-names': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-have-you-been-known-by-any-other-names'],
            additionalProperties: false,
            properties: {
                'q-applicant-have-you-been-known-by-any-other-names': {
                    type: 'boolean',
                    title: 'Have you ever been known by any other names?',
                    errorMessages: {
                        required: 'Select yes if you have been known by any other names'
                    }
                }
            }
        },
        'p-applicant-what-other-names-have-you-used': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-what-other-names-have-you-used'],
            additionalProperties: false,
            properties: {
                'q-applicant-what-other-names-have-you-used': {
                    type: 'string',
                    title: 'What other names have you used?',
                    maxLength: 50,
                    errorMessages: {
                        required: 'Enter the other names you have used',
                        maxLength: 'Other names you have used must be 50 characters or less'
                    }
                }
            }
        },
        'p-applicant-enter-your-date-of-birth': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-enter-your-date-of-birth'],
            additionalProperties: false,
            properties: {
                'q-applicant-enter-your-date-of-birth': {
                    type: 'string',
                    format: 'date-time',
                    title: 'Enter your date of birth',
                    description: 'For example, 31 3 2018.',
                    errorMessages: {
                        required: 'Enter your date of birth'
                    }
                }
            }
        },
        'p-applicant-enter-your-email-address': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-email-address'],
            additionalProperties: false,
            properties: {
                'q-applicant-email-address': {
                    type: 'string',
                    title: 'Enter your email address',
                    description:
                        "We'll use this to contact you about your application for example, to request more information.",
                    maxLength: 50,
                    errorMessages: {
                        required: 'Enter your email address',
                        maxLength: 'Email address must be 50 characters or less'
                    }
                }
            }
        },
        'p-applicant-enter-your-address': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'Enter your address',
            required: ['q-applicant-building-and-street', 'q-applicant-town-or-city'],
            additionalProperties: false,
            properties: {
                'q-applicant-building-and-street': {
                    type: 'string',
                    title: 'Building and street',
                    maxLength: 60,
                    errorMessages: {
                        maxLength: 'First line of address must be less than 60 characters'
                    }
                },
                'q-applicant-building-and-street2': {
                    type: 'string',
                    maxLength: 60,
                    errorMessages: {
                        maxLength: 'Second line of address must be less than 60 characters'
                    }
                },
                'q-applicant-town-or-city': {
                    type: 'string',
                    title: 'Town or city',
                    maxLength: 60,
                    errorMessages: {
                        required: 'Enter the town or city where you live',
                        maxLength: 'Town or city must be 60 characters or less'
                    }
                },
                'q-applicant-county': {
                    type: 'string',
                    title: 'County',
                    maxLength: 60,
                    errorMessages: {
                        maxLength: 'County must be 60 characters or less'
                    }
                },
                'q-applicant-postcode': {
                    type: 'string',
                    title: 'Postcode',
                    maxLength: 10,
                    errorMessages: {
                        maxLength: 'Postcode must be 10 characters or less'
                    }
                }
            }
        },
        'p-applicant-enter-your-telephone-number': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-telephone-number'],
            additionalProperties: false,
            properties: {
                'q-applicant-telephone-number': {
                    type: 'string',
                    title: 'Enter your telephone number',
                    description:
                        'We may use this to contact you if we need to clarify something on your application form.',
                    maxLength: 20,
                    errorMessages: {
                        required:
                            'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192',
                        maxLength: 'Telephone number must be 20 characters or less'
                    }
                }
            }
        },
        'p--check-your-answers': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            additionalProperties: false,
            properties: {
                'p-check-your-answers': {
                    summaryInfo: {
                        'p-applicant-enter-your-name': {
                            displayName: 'Name'
                        },
                        'p-applicant-have-you-been-known-by-any-other-names': {
                            displayName: 'Have you been known by other names?'
                        },
                        'p-applicant-what-other-names-have-you-used': {
                            displayName: 'Other names'
                        },
                        'p-applicant-enter-your-date-of-birth': {
                            displayName: 'Date of birth'
                        },
                        'p-applicant-enter-your-email-address': {
                            displayName: 'Email'
                        },
                        'p-applicant-enter-your-address': {
                            displayName: 'Address'
                        },
                        'p-applicant-enter-your-telephone-number': {
                            displayName: 'Phone Number'
                        },
                        'p-applicant-british-citizen-or-eu-national': {
                            displayName: 'Are you a British citizen or EU National?'
                        },
                        'p-applicant-are-you-18-or-over': {
                            displayName: 'Are you 18 or over?'
                        },
                        'p-applicant-who-are-you-applying-for': {
                            displayName: 'Who are you applying for?'
                        },
                        'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                            displayName: 'Were you a victim of sexual assault or abuse?'
                        },
                        'p-applicant-select-the-option-that-applies-to-you': {
                            displayName: 'Select the option that applies'
                        },
                        'p-applicant-did-the-crime-happen-once-or-over-time': {
                            displayName: 'Did the crime happen once or over a period of time?'
                        },
                        'p-applicant-when-did-the-crime-happen': {
                            displayName: 'When did the crime happen?'
                        },
                        'p-applicant-when-did-the-crime-start': {
                            displayName: 'When did the crime start?'
                        },
                        'p-applicant-when-did-the-crime-stop': {
                            displayName: 'When did the crime stop?'
                        },
                        'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
                            displayName: 'Reasons for the delay in making your application'
                        },
                        'p-applicant-where-did-the-crime-happen': {
                            displayName: 'Where did the crime happen?'
                        },
                        'p-applicant-where-in-england-did-it-happen': {
                            displayName: 'Where in England did it happen?'
                        },
                        'p-applicant-where-in-scotland-did-it-happen': {
                            displayName: 'Where in Scotland did it happen?'
                        },
                        'p-applicant-where-in-wales-did-it-happen': {
                            displayName: 'Where in Wales did it happen?'
                        },
                        'p-offender-do-you-know-the-name-of-the-offender': {
                            displayName: 'Do you know the name of the offender?'
                        },
                        'p-offender-enter-offenders-name': {
                            displayName: 'Offenders name'
                        },
                        'p-offender-describe-contact-with-offender': {
                            displayName: 'Describe your contact with the offender'
                        },
                        'p--was-the-crime-reported-to-police': {
                            displayName: 'Was the crime reported to police?'
                        },
                        'p--which-english-police-force-is-investigating-the-crime': {
                            displayName: 'Which police force is investigating?'
                        },
                        'p--which-police-scotland-division-is-investigating-the-crime': {
                            displayName: 'Which police force is investigating?'
                        },
                        'p--which-welsh-police-force-is-investigating-the-crime': {
                            displayName: 'Which police force is investigating?'
                        },
                        'p--when-was-the-crime-reported-to-police': {
                            displayName: 'When was the crime reported?'
                        },
                        'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
                            displayName: 'Reasons for delay in reporting crime'
                        },
                        'p--whats-the-crime-reference-number': {
                            displayName: 'Crime reference number'
                        },
                        'p-applicant-have-you-applied-to-us-before': {
                            displayName: 'Have you applied before?'
                        },
                        'p-applicant-have-you-applied-for-or-received-any-other-compensation': {
                            displayName: 'Have you received other compensation?'
                        },
                        'p-applicant-other-compensation-details': {
                            displayName: 'Details of other compensation received'
                        }
                    }
                }
            }
        },
        'p--confirmation': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            additionalProperties: false,
            properties: {
                confirmation: {
                    description:
                        '\n                <div class="govuk-grid-column-two-thirds">\n                    {{ govukPanel({\n                        titleText: "Application submitted",\n                        html: "**Reference Number here**"\n                    }) }}\n                    <p></p>\n                    <p class="govuk-body-l">Thank you for submitting your application.</p>\n                    <p class="govuk-body-l">We have sent a confirmation email to <strong>**Email here**</strong></p>\n                    <h2 class="govuk-heading-m">What happens next</h2>\n                    <p>We will:</p>\n                    <ul class="govuk-list govuk-list--bullet">\n                    <li>ask the police for evidence</li>\n                    <li>use the police evidence to make a decision</li>\n                    <li>send our decision to **Email here**</li>\n                    </ul>\n                    <p class="govuk-body">We will usually make a decision within 4 months.</p>\n                    {{ govukWarningText({\n                        text: "You must inform us immediately if any of the information you have given us changes, especially your address, telephone number or email address.",\n                        iconFallbackText: "Warning"\n                    }) }}\n                    <p class="govuk-body">You can contact our Customer Service Centre on 0300 003 3601. Select option 8 when the call is answered.</p>\n                    <p><a href="/application/confirmation-page-if-automatic-nil">What did you think of this service?</a> (takes 30 seconds)</p>\n                    <p><a href="/application/application-submitted-email">Check your inbox</a></p>\n                </div>\n            '
                }
            }
        },
        'p-applicant-redirect-to-our-other-application': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            title: 'You are being redirected to our other application site',
            additionalProperties: false,
            properties: {
                'you-need-a-different-service': {
                    description:
                        '<p><strong>You can continue your application using our existing service.</strong></p>'
                }
            }
        },
        'p-applicant-you-cannot-get-compensation': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'You can not get compensation',
            type: 'object',
            additionalProperties: false,
            properties: {
                'you-cannot-get-compensation': {
                    description:
                        '\n                <p class="govuk-body-l">If the crime has not been reported to the police we can not pay compensation.</p>\n                <p class="govuk-body">You may continue your application, but any future application for the same injuries will be refused.</p>\n            '
                }
            }
        }
    },
    routes: {
        initial: 'p-applicant-declaration',
        states: {
            'p-applicant-declaration': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-british-citizen-or-eu-national'
                        }
                    ]
                }
            },
            'p-applicant-british-citizen-or-eu-national': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                '==',
                                '$.answers.p-applicant-british-citizen-or-eu-national.q-applicant-british-citizen-or-eu-national',
                                false
                            ]
                        },
                        {
                            target: 'p-applicant-are-you-18-or-over',
                            cond: [
                                '==',
                                '$.answers.p-applicant-british-citizen-or-eu-national.q-applicant-british-citizen-or-eu-national',
                                true
                            ]
                        }
                    ]
                }
            },
            'p-applicant-are-you-18-or-over': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                '==',
                                '$.answers.p-applicant-are-you-18-or-over.q-applicant-are-you-18-or-over',
                                false
                            ]
                        },
                        {
                            target: 'p-applicant-who-are-you-applying-for',
                            cond: [
                                '==',
                                '$.answers.p-applicant-are-you-18-or-over.q-applicant-are-you-18-or-over',
                                true
                            ]
                        }
                    ]
                }
            },
            'p-applicant-who-are-you-applying-for': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                '==',
                                '$.answers.p-applicant-who-are-you-applying-for.q-applicant-who-are-you-applying-for',
                                'someone-else'
                            ]
                        },
                        {
                            target: 'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse',
                            cond: [
                                '==',
                                '$.answers.p-applicant-who-are-you-applying-for.q-applicant-who-are-you-applying-for',
                                'myself'
                            ]
                        }
                    ]
                }
            },
            'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                '==',
                                '$.answers.p-applicant-were-you-a-victim-of-sexual-assault-or-abuse.q-applicant-were-you-a-victim-of-sexual-assault-or-abuse',
                                false
                            ]
                        },
                        {
                            target: 'p--before-you-continue',
                            cond: [
                                '==',
                                '$.answers.p-applicant-were-you-a-victim-of-sexual-assault-or-abuse.q-applicant-were-you-a-victim-of-sexual-assault-or-abuse',
                                true
                            ]
                        }
                    ]
                }
            },
            'p--before-you-continue': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-select-the-option-that-applies-to-you'
                        }
                    ]
                }
            },
            'p-applicant-select-the-option-that-applies-to-you': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                '==',
                                '$.answers.p-applicant-select-the-option-that-applies-to-you.q-applicant-option',
                                'option-2-sexual-assault-or-abuse-and-other-injuries-ro-losses'
                            ]
                        },
                        {
                            target: 'p--was-the-crime-reported-to-police',
                            cond: [
                                '==',
                                '$.answers.p-applicant-select-the-option-that-applies-to-you.q-applicant-option',
                                'option-1-sexual-assault-or-abuse'
                            ]
                        }
                    ]
                }
            },
            'p--was-the-crime-reported-to-police': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-you-cannot-get-compensation',
                            cond: [
                                '==',
                                '$.answers.p--was-the-crime-reported-to-police.q-was-the-crime-reported-to-police',
                                false
                            ]
                        },
                        {
                            target: 'p--when-was-the-crime-reported-to-police',
                            cond: [
                                '==',
                                '$.answers.p--was-the-crime-reported-to-police.q-was-the-crime-reported-to-police',
                                true
                            ]
                        }
                    ]
                }
            },
            'p--when-was-the-crime-reported-to-police': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--whats-the-crime-reference-number'
                        }
                    ]
                }
            },
            'p--whats-the-crime-reference-number': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-did-the-crime-happen-once-or-over-time'
                        }
                    ]
                }
            },
            'p-applicant-did-the-crime-happen-once-or-over-time': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-when-did-the-crime-happen',
                            cond: [
                                '==',
                                '$.answers.p-applicant-did-the-crime-happen-once-or-over-time.q-applicant-did-the-crime-happen-once-or-over-time',
                                'once'
                            ]
                        },
                        {
                            target: 'p-applicant-when-did-the-crime-start',
                            cond: [
                                '==',
                                '$.answers.p-applicant-did-the-crime-happen-once-or-over-time.q-applicant-did-the-crime-happen-once-or-over-time',
                                'over-a-period-of-time'
                            ]
                        }
                    ]
                }
            },
            'p-applicant-when-did-the-crime-happen': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-select-reasons-for-the-delay-in-making-your-application',
                            cond: [
                                'dateExceedsTwoYearsFromNow',
                                '$.answers.p-applicant-when-did-the-crime-happen.q-applicant-when-did-the-crime-happen'
                            ]
                        },
                        {
                            target: 'p-applicant-where-did-the-crime-happen'
                        }
                    ]
                }
            },
            'p-applicant-when-did-the-crime-start': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-when-did-the-crime-stop'
                        }
                    ]
                }
            },
            'p-applicant-when-did-the-crime-stop': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-select-reasons-for-the-delay-in-making-your-application',
                            cond: [
                                'dateExceedsTwoYearsFromNow',
                                '$.answers.p-applicant-when-did-the-crime-stop.q-applicant-when-did-the-crime-stop'
                            ]
                        },
                        {
                            target: 'p-applicant-where-did-the-crime-happen'
                        }
                    ]
                }
            },
            'p-applicant-select-reasons-for-the-delay-in-making-your-application': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-where-did-the-crime-happen'
                        }
                    ]
                }
            },
            'p-applicant-where-did-the-crime-happen': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-where-in-england-did-it-happen',
                            cond: [
                                '==',
                                '$.answers.p-applicant-where-did-the-crime-happen.q-applicant-where-did-the-crime-happen',
                                'england'
                            ]
                        },
                        {
                            target: 'p-applicant-where-in-scotland-did-it-happen',
                            cond: [
                                '==',
                                '$.answers.p-applicant-where-did-the-crime-happen.q-applicant-where-did-the-crime-happen',
                                'scotland'
                            ]
                        },
                        {
                            target: 'p-applicant-where-in-wales-did-it-happen',
                            cond: [
                                '==',
                                '$.answers.p-applicant-where-did-the-crime-happen.q-applicant-where-did-the-crime-happen',
                                'wales'
                            ]
                        },
                        {
                            target: 'p--you-need-to-contact-us',
                            cond: [
                                '==',
                                '$.answers.p-applicant-where-did-the-crime-happen.q-applicant-where-did-the-crime-happen',
                                'somewhere-else'
                            ]
                        }
                    ]
                }
            },
            'p-applicant-where-in-england-did-it-happen': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--which-english-police-force-is-investigating-the-crime'
                        }
                    ]
                }
            },
            'p-applicant-where-in-scotland-did-it-happen': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--which-police-scotland-division-is-investigating-the-crime'
                        }
                    ]
                }
            },
            'p-applicant-where-in-wales-did-it-happen': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--which-welsh-police-force-is-investigating-the-crime'
                        }
                    ]
                }
            },
            'p--you-need-to-contact-us': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-you-cannot-get-compensation'
                        }
                    ]
                }
            },
            'p--which-english-police-force-is-investigating-the-crime': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police',
                            cond: [
                                'dateDifferenceGreaterThanTwoDays',
                                '$.answers.p--when-was-the-crime-reported-to-police.q--when-was-the-crime-reported-to-police',
                                [
                                    'or',
                                    [
                                        'q-applicant-when-did-the-crime-happen',
                                        '$.answers.p-applicant-when-did-the-crime-stop.q-applicant-when-did-the-crime-stop'
                                    ]
                                ]
                            ]
                        },
                        {
                            target: 'p-offender-do-you-know-the-name-of-the-offender'
                        }
                    ]
                }
            },
            'p--which-police-scotland-division-is-investigating-the-crime': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police',
                            cond: [
                                'dateDifferenceGreaterThanTwoDays',
                                '$.answers.p--when-was-the-crime-reported-to-police.q--when-was-the-crime-reported-to-police',
                                [
                                    'or',
                                    [
                                        'q-applicant-when-did-the-crime-happen',
                                        '$.answers.p-applicant-when-did-the-crime-stop.q-applicant-when-did-the-crime-stop'
                                    ]
                                ]
                            ]
                        },
                        {
                            target: 'p-offender-do-you-know-the-name-of-the-offender'
                        }
                    ]
                }
            },
            'p--which-welsh-police-force-is-investigating-the-crime': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police',
                            cond: [
                                'dateDifferenceGreaterThanTwoDays',
                                '$.answers.p--when-was-the-crime-reported-to-police.q--when-was-the-crime-reported-to-police',
                                [
                                    'or',
                                    [
                                        'q-applicant-when-did-the-crime-happen',
                                        '$.answers.p-applicant-when-did-the-crime-stop.q-applicant-when-did-the-crime-stop'
                                    ]
                                ]
                            ]
                        },
                        {
                            target: 'p-offender-do-you-know-the-name-of-the-offender'
                        }
                    ]
                }
            },
            'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-offender-do-you-know-the-name-of-the-offender'
                        }
                    ]
                }
            },
            'p-offender-do-you-know-the-name-of-the-offender': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-have-you-applied-to-us-before',
                            cond: [
                                '==',
                                '$.answers.p-offender-do-you-know-the-name-of-the-offender.q-offender-do-you-know-the-name-of-the-offender',
                                false
                            ]
                        },
                        {
                            target: 'p-offender-enter-offenders-name',
                            cond: [
                                '==',
                                '$.answers.p-offender-do-you-know-the-name-of-the-offender.q-offender-do-you-know-the-name-of-the-offender',
                                true
                            ]
                        }
                    ]
                }
            },
            'p-offender-enter-offenders-name': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-offender-describe-contact-with-offender'
                        }
                    ]
                }
            },
            'p-offender-describe-contact-with-offender': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-have-you-applied-to-us-before'
                        }
                    ]
                }
            },
            'p-applicant-have-you-applied-to-us-before': {
                on: {
                    ANSWER: [
                        {
                            target:
                                'p-applicant-have-you-applied-for-or-received-any-other-compensation'
                        }
                    ]
                }
            },
            'p-applicant-have-you-applied-for-or-received-any-other-compensation': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-other-compensation-details',
                            cond: [
                                '==',
                                '$.answers.p-applicant-have-you-applied-for-or-received-any-other-compensation.q-applicant-have-you-applied-for-or-received-any-other-compensation',
                                true
                            ]
                        },
                        {
                            target: 'p-applicant-enter-your-name',
                            cond: [
                                '==',
                                '$.answers.p-applicant-have-you-applied-for-or-received-any-other-compensation.q-applicant-have-you-applied-for-or-received-any-other-compensation',
                                false
                            ]
                        }
                    ]
                }
            },
            'p-applicant-other-compensation-details': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-enter-your-name'
                        }
                    ]
                }
            },
            'p-applicant-enter-your-name': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-have-you-been-known-by-any-other-names'
                        }
                    ]
                }
            },
            'p-applicant-have-you-been-known-by-any-other-names': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-enter-your-date-of-birth',
                            cond: [
                                '==',
                                '$.answers.p-applicant-have-you-been-known-by-any-other-names.q-applicant-have-you-been-known-by-any-other-names',
                                false
                            ]
                        },
                        {
                            target: 'p-applicant-what-other-names-have-you-used',
                            cond: [
                                '==',
                                '$.answers.p-applicant-have-you-been-known-by-any-other-names.q-applicant-have-you-been-known-by-any-other-names',
                                true
                            ]
                        }
                    ]
                }
            },
            'p-applicant-what-other-names-have-you-used': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-enter-your-date-of-birth'
                        }
                    ]
                }
            },
            'p-applicant-enter-your-date-of-birth': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application',
                            cond: [
                                'dateLessThanEighteenYearsAgo',
                                '$.answers.p-applicant-enter-your-date-of-birth.q-applicant-enter-your-date-of-birth'
                            ]
                        },
                        {
                            target: 'p-applicant-enter-your-email-address'
                        }
                    ]
                }
            },
            'p-applicant-enter-your-email-address': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-enter-your-address'
                        }
                    ]
                }
            },
            'p-applicant-enter-your-address': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-enter-your-telephone-number'
                        }
                    ]
                }
            },
            'p-applicant-enter-your-telephone-number': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--check-your-answers'
                        }
                    ]
                }
            },
            'p--check-your-answers': {
                on: {
                    ANSWER: [
                        {
                            target: 'p--confirmation'
                        }
                    ]
                }
            },
            'p--confirmation': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application'
                        }
                    ]
                }
            },
            'p-applicant-redirect-to-our-other-application': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-redirect-to-our-other-application'
                        }
                    ]
                }
            },
            'p-applicant-you-cannot-get-compensation': {
                on: {
                    ANSWER: [
                        {
                            target: 'p-applicant-did-the-crime-happen-once-or-over-time'
                        }
                    ]
                }
            }
        }
    }
};
