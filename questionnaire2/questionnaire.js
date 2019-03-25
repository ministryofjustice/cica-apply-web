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
                        '\n                <p><strong>By continuing you confirm that the information you will give is true as far as you know.</strong></p>\n                {{ govukWarningText({\n                    text: "You could be prosecuted or get less compensation if you give false or misleading information.",\n                    iconFallbackText: "Warning"\n                }) }}\n            '
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
                        '\n                <p class="govuk-body">On the next page we will ask you to select an option based on how the crime affected you.</p>\n                <p class="govuk-body">We appreciate that this may be difficult for you.</p>\n                <h2 class="govuk-heading-m">If you need help or support</h2>\n                <p class="govuk-body">You can contact us for help with your application on 0300 003 3601. Select option 8.</p>\n                <p class="govuk-body">Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>\n                <p class="govuk-body">For practical or emotional support near you <a href="https://www.victimsinformationservice.org.uk/" target="_blank">visit the Victim and Witness Information</a> website.</p>\n                <p class="govuk-body">There is a different website if you live in <a href="https://www.mygov.scot/victim-witness-support/">Scotland</a>.</p>\n            '
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
                            const: 'opt1'
                        },
                        {
                            title: 'Option 2: Sexual assault or abuse and other injuries or losses',
                            const: 'opt2'
                        }
                    ],
                    errorMessages: {
                        required: 'Select your choice'
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
                    formatMaximum: '2019-03-13T16:12:12.194Z',
                    title: 'When was the crime reported to the police?',
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
                    errorMessages: {
                        required: 'Enter the crime reference number'
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
                    formatMaximum: '2019-03-13T16:12:12.211Z',
                    title: 'When did the crime happen?',
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
                    formatMaximum: '2019-03-13T16:12:12.216Z',
                    title: 'When did it start?',
                    errorMessages: {
                        required: 'Enter the date the crime started and include a month and year',
                        format: 'The date the crime started must be in the past'
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
                    formatMaximum: '2019-03-13T16:12:12.220Z',
                    title: 'When did it stop?',
                    errorMessages: {
                        required: 'Enter the date the crime started and include a month and year',
                        format: 'The date the crime stopped must be in the past'
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
            required: ['q-applicant-reason-for-delay-in-application'],
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
                                const: 'underage'
                            },
                            {
                                title: 'I was advised to wait',
                                const: 'wait'
                            },
                            {
                                title: 'Medical reasons',
                                const: 'med'
                            },
                            {
                                title: 'Other reasons',
                                const: 'other'
                            }
                        ]
                    },
                    errorMessages: {
                        required: 'Select your choice'
                    }
                },
                'q-applicant-explain-delay-reasons': {
                    title: 'Briefly explain these reasons',
                    type: 'string',
                    maxLength: 500
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
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened'
                    }
                },
                'q-applicant-english-location': {
                    type: 'string',
                    title: 'Location',
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark'
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
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened'
                    }
                },
                'q-applicant-scottish-location': {
                    type: 'string',
                    title: 'Location',
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark'
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
                    errorMessages: {
                        required: 'Enter the town or city where the crime happened'
                    }
                },
                'q-applicant-welsh-location': {
                    type: 'string',
                    title: 'Location',
                    errorMessages: {
                        required:
                            'Enter the name of a street, business, building or nearby local landmark'
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
                'applicant-declaration': {
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
                    type: 'string',
                    oneOf: [
                        {
                            title: 'Avon And Somerset Constabulary',
                            const: 'avon-and-somerset-constabulary'
                        },
                        {
                            title: 'Bedfordshire Police',
                            const: 'bedfordshire-police'
                        },
                        {
                            title: 'British Transport Police',
                            const: 'british-transport-police'
                        },
                        {
                            title: 'Cambridgeshire Constabulary',
                            const: 'cambridgeshire-constabulary'
                        },
                        {
                            title: 'Cheshire Constabulary',
                            const: 'cheshire-constabulary'
                        },
                        {
                            title: 'City Of London Police',
                            const: 'city-of-london-police'
                        },
                        {
                            title: 'Cleveland Police',
                            const: 'cleveland-police'
                        },
                        {
                            title: 'Cumbria Constabulary',
                            const: 'cumbria-constabulary'
                        },
                        {
                            title: 'Derbyshire Constabulary',
                            const: 'derbyshire-constabulary'
                        },
                        {
                            title: 'Devon and Cornwall Police',
                            const: 'devon-and-cornwall-police'
                        },
                        {
                            title: 'Dorset Police',
                            const: 'dorset-police'
                        },
                        {
                            title: 'Durham Constabulary',
                            const: 'durham-constabulary'
                        },
                        {
                            title: 'Essex Police',
                            const: 'essex-police'
                        },
                        {
                            title: 'Gloucestershire Constabulary',
                            const: 'gloucestershire-constabulary'
                        },
                        {
                            title: 'Greater Manchester Police',
                            const: 'greater-manchester-police'
                        },
                        {
                            title: 'Hampshire Constabulary',
                            const: 'hampshire-constabulary'
                        },
                        {
                            title: 'Hertfordshire Constabulary',
                            const: 'hertfordshire-constabulary'
                        },
                        {
                            title: 'Humberside Police',
                            const: 'humberside-police'
                        },
                        {
                            title: 'Kent Police',
                            const: 'kent-police'
                        },
                        {
                            title: 'Lancashire Constabulary',
                            const: 'lancashire-constabulary'
                        },
                        {
                            title: 'Leicestershire Police',
                            const: 'leicestershire-police'
                        },
                        {
                            title: 'Lincolnshire Police',
                            const: 'lincolnshire-police'
                        },
                        {
                            title: 'Merseyside Police',
                            const: 'merseyside-police'
                        },
                        {
                            title: 'Metropolitan Barking',
                            const: 'metropolitan-barking'
                        },
                        {
                            title: 'Metropolitan Barnet',
                            const: 'metropolitan-barnet'
                        },
                        {
                            title: 'Metropolitan Bexley',
                            const: 'metropolitan-bexley'
                        },
                        {
                            title: 'Metropolitan Brent',
                            const: 'metropolitan-brent'
                        },
                        {
                            title: 'Metropolitan Bromley',
                            const: 'metropolitan-bromley'
                        },
                        {
                            title: 'Metropolitan Camden',
                            const: 'metropolitan-camden'
                        },
                        {
                            title: 'Metropolitan Croydon',
                            const: 'metropolitan-croydon'
                        },
                        {
                            title: 'Metropolitan Ealing',
                            const: 'metropolitan-ealing'
                        },
                        {
                            title: 'Metropolitan Enfield',
                            const: 'metropolitan-enfield'
                        },
                        {
                            title: 'Metropolitan Greenwich',
                            const: 'metropolitan-greenwich'
                        },
                        {
                            title: 'Metropolitan Hackney',
                            const: 'metropolitan-hackney'
                        },
                        {
                            title: 'Metropolitan Hammersmith',
                            const: 'metropolitan-hammersmith'
                        },
                        {
                            title: 'Metropolitan Haringey',
                            const: 'metropolitan-haringey'
                        },
                        {
                            title: 'Metropolitan Harrow',
                            const: 'metropolitan-harrow'
                        },
                        {
                            title: 'Metropolitan Havering',
                            const: 'metropolitan-havering'
                        },
                        {
                            title: 'Metropolitan Hillingdon',
                            const: 'metropolitan-hillingdon'
                        },
                        {
                            title: 'Metropolitan Hounslow',
                            const: 'metropolitan-hounslow'
                        },
                        {
                            title: 'Metropolitan Islington',
                            const: 'metropolitan-islington'
                        },
                        {
                            title: 'Metropolitan Kensington',
                            const: 'metropolitan-kensington'
                        },
                        {
                            title: 'Metropolitan Kingston',
                            const: 'metropolitan-kingston'
                        },
                        {
                            title: 'Metropolitan Lambeth',
                            const: 'metropolitan-lambeth'
                        },
                        {
                            title: 'Metropolitan Lewisham',
                            const: 'metropolitan-lewisham'
                        },
                        {
                            title: 'Metropolitan Merton',
                            const: 'metropolitan-merton'
                        },
                        {
                            title: 'Metropolitan Newham',
                            const: 'metropolitan-newham'
                        },
                        {
                            title: 'Metropolitan Redbridge',
                            const: 'metropolitan-redbridge'
                        },
                        {
                            title: 'Metropolitan Richmond',
                            const: 'metropolitan-richmond'
                        },
                        {
                            title: 'Metropolitan Southwark',
                            const: 'metropolitan-southwark'
                        },
                        {
                            title: 'Metropolitan Sutton',
                            const: 'metropolitan-sutton'
                        },
                        {
                            title: 'Metropolitan Tower Hamlets',
                            const: 'metropolitan-tower-hamlets'
                        },
                        {
                            title: 'Metropolitan Waltham Forest',
                            const: 'metropolitan-waltham-forest'
                        },
                        {
                            title: 'Metropolitan Wandsworth',
                            const: 'metropolitan-wandsworth'
                        },
                        {
                            title: 'Metropolitan Westminster',
                            const: 'metropolitan-westminster'
                        },
                        {
                            title: 'Norfolk Constabulary',
                            const: 'norfolk-constabulary'
                        },
                        {
                            title: 'North Yorkshire Police',
                            const: 'north-yorkshire-police'
                        },
                        {
                            title: 'Northamptonshire Police',
                            const: 'northamptonshire-police'
                        },
                        {
                            title: 'Northumbria Police',
                            const: 'northumbria-police'
                        },
                        {
                            title: 'Nottinghamshire Police',
                            const: 'Nottinghamshire-police'
                        },
                        {
                            title: 'South Yorkshire Police',
                            const: 'south-yorkshire-police'
                        },
                        {
                            title: 'Staffordshire Police',
                            const: 'staffordshire-police'
                        },
                        {
                            title: 'Suffolk Constabulary',
                            const: 'suffolk-constabulary'
                        },
                        {
                            title: 'Surrey Police',
                            const: 'Surrey-police'
                        },
                        {
                            title: 'Sussex Police',
                            const: 'sussex-police'
                        },
                        {
                            title: 'Thames Valley Police',
                            const: 'thames-valley-police'
                        },
                        {
                            title: 'Warwickshire Police',
                            const: 'warwickshire-police'
                        },
                        {
                            title: 'West Mercia Police',
                            const: 'west-mercia-police'
                        },
                        {
                            title: 'West Midlands Police',
                            const: 'west-midlands-police'
                        },
                        {
                            title: 'West Yorkshire Police',
                            const: 'west-yorkshire-police'
                        },
                        {
                            title: 'Wiltshire Police',
                            const: 'wiltshire-police'
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
                    type: 'string',
                    oneOf: [
                        {
                            title: 'Argyll and West Dunbartonshire',
                            const: 'argyll'
                        },
                        {
                            title: 'Ayrshire',
                            const: 'ayrshire'
                        },
                        {
                            title: 'British Transport Police',
                            const: 'transport'
                        },
                        {
                            title: 'Dumfries and Galloway',
                            const: 'dumfries'
                        },
                        {
                            title: 'Edinburgh',
                            const: 'edinburgh'
                        },
                        {
                            title: 'Fife',
                            const: 'fife'
                        },
                        {
                            title: 'Forth Valley',
                            const: 'forthValley'
                        },
                        {
                            title: 'Greater Glasgow',
                            const: 'glasgow'
                        },
                        {
                            title: 'Highland and Islands',
                            const: 'highlands'
                        },
                        {
                            title: 'Lanarkshire',
                            const: 'lanarkshire'
                        },
                        {
                            title: 'North East',
                            const: 'northEast'
                        },
                        {
                            title: 'Renfrewshire and Inverclyde',
                            const: 'renfrewshire'
                        },
                        {
                            title: 'Tayside',
                            const: 'tayside'
                        },
                        {
                            title: 'The Lothians and Scottish Borders',
                            const: 'lothians'
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
                    type: 'string',
                    oneOf: [
                        {
                            title: 'British Transport Police',
                            const: 'transport'
                        },
                        {
                            title: 'Dyfed-Powys',
                            const: 'dyfed'
                        },
                        {
                            title: 'Gwent',
                            const: 'gwent'
                        },
                        {
                            title: 'North Wales',
                            const: 'northWales'
                        },
                        {
                            title: 'South Wales',
                            const: 'southWales'
                        }
                    ],
                    errorMessages: {
                        required: 'Select a Police force'
                    }
                }
            }
        },
        'p-applicant-select-reasons-for-the-delay-in-reporting-the-crime-to-police': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            required: ['q-applicant-reason-for-delay-in-reporting-crime'],
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
                                const: 'underage'
                            },
                            {
                                title: 'Unable to report the crime',
                                const: 'unable'
                            },
                            {
                                title: 'Other reasons',
                                const: 'other'
                            }
                        ]
                    },
                    errorMessages: {
                        required: 'Select your choice'
                    }
                },
                'q-applicant-explain-delay-reasons': {
                    title: 'Briefly explain these reasons',
                    type: 'string',
                    maxLength: 500
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
            required: ['q-offenders-name'],
            additionalProperties: false,
            properties: {
                'q-offenders-name': {
                    title: 'Enter their name',
                    type: 'string',
                    errorMessages: {
                        required: "Enter the offender's name"
                    }
                }
            }
        },
        'p-offender-describe-contact-with-offender': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            additionalProperties: false,
            propertyNames: {
                enum: ['q-offender-contact-description', 'q-offender-no-contact-with-offender']
            },
            properties: {
                'q-offender-contact-description': {
                    type: 'string',
                    title: 'If you have contact with the offender, describe it below',
                    maxLength: 500,
                    errorMessages: {
                        required:
                            "Please describe your contact with the offender, or click 'I have no contact with the offender'"
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
                    },
                    errorMessages: {
                        required:
                            "Please describe your contact with the offender, or click 'I have no contact with the offender'"
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
                            properties: {
                                'q-offender-no-contact-with-offender': {
                                    const: 'none'
                                }
                            }
                        }
                    },
                    then: {
                        required: ['q-offender-contact-description'],
                        propertyNames: {
                            enum: [
                                'q-offender-no-contact-with-offender',
                                'q-offender-contact-description'
                            ]
                        }
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
                    title: 'Enter your previous reference number if you know it (optional)'
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
                        required: ['q-enter-your-previous-reference-number'],
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
                    errorMessages: {
                        required:
                            'Select yes if you have applied for or received another form of compensation'
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
                    errorMessages: {
                        required:
                            'Enter the source of the other compensation, for example, the name of a person, company or court'
                    }
                },
                'q-applicant-has-a-decision-been-made': {
                    title: 'Have they made a decision?',
                    type: 'boolean'
                },
                'q-how-much-was-award': {
                    type: 'string',
                    title: 'How much was the award?',
                    errorMessages: {
                        required: 'Enter the amount of compensation you got'
                    }
                },
                'q-when-will-you-find-out': {
                    type: 'string',
                    title: 'When will you find out?',
                    description:
                        'Enter an approximate date, for example, December 2019. If you do not know you can say so.'
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
                    errorMessages: {
                        required: 'Enter your title'
                    }
                },
                'q-applicant-name-firstname': {
                    title: 'First name',
                    type: 'string',
                    errorMessages: {
                        required: 'Enter your first name'
                    }
                },
                'q-applicant-name-lastname': {
                    title: 'Last name',
                    type: 'string',
                    errorMessages: {
                        required: 'Enter your last name'
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
                    errorMessages: {
                        required: 'Enter the other names you have used'
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
                    formatMaximum: {
                        $ref:
                            "#/answers/p--when-was-the-crime-reported-to-police/q-was-the-crime-reported-to-police/value'"
                    },
                    title: 'Enter your date of birth',
                    errorMessages: {
                        required: 'Enter your date of birth',
                        format: 'Enter a real date of birth'
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
                    errorMessages: {
                        required: 'Enter your email address'
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
                    errorMessages: {
                        required: 'Enter the building and street where you live'
                    }
                },
                'q-applicant-building-and-street2': {
                    type: 'string'
                },
                'q-applicant-town-or-city': {
                    type: 'string',
                    title: 'Town or city',
                    errorMessages: {
                        required: 'Enter the town or city where you live'
                    }
                },
                'q-applicant-county': {
                    type: 'string',
                    title: 'County'
                },
                'q-applicant-postcode': {
                    type: 'string',
                    title: 'Postcode'
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
                    errorMessages: {
                        required:
                            'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                    }
                }
            }
        },
        'p--check-your-answers': {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            additionalProperties: false,
            properties: {},
            context: 'summary'
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
                'applicant-declaration': {
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
                                'opt2'
                            ]
                        },
                        {
                            target: 'p--was-the-crime-reported-to-police',
                            cond: [
                                '==',
                                '$.answers.p-applicant-select-the-option-that-applies-to-you.q-applicant-option',
                                'opt1'
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
                                '$.answers.p-applicant-when-did-the-crime-happen.q-applicant-when-did-the-crime-happen'
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
                                '$.answers.p-applicant-when-did-the-crime-happen.q-applicant-when-did-the-crime-happen'
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
                                '$.answers.p-applicant-when-did-the-crime-happen.q-applicant-when-did-the-crime-happen'
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
