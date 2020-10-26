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
            pageContext: 'summary',
            properties: {
                'p-check-your-answers': {
                    options: {
                        summaryStructure: [
                            {
                                title: 'About the application',
                                questions: {
                                    'p-applicant-fatal-claim':
                                        'Are you applying for someone who died from their injuries?',
                                    'p-applicant-who-are-you-applying-for':
                                        'Who are you applying for?',
                                    'p-applicant-are-you-18-or-over': 'Are you 18 or over?',
                                    'p-applicant-confirmation-method': 'Confirmation method',
                                    'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse':
                                        'Were you a victim of sexual assault or abuse?',
                                    'p-applicant-victim-of-violent-crime':
                                        'Were you a victim of violent crime?',
                                    'p-applicant-select-reasons-for-the-delay-in-making-your-application':
                                        'Reasons for the delay in making your application'
                                }
                            },
                            {
                                title: 'Your details',
                                questions: {
                                    'p-applicant-enter-your-name': 'Name',
                                    'p-applicant-have-you-been-known-by-any-other-names':
                                        'Have you been known by any other names?',
                                    'p-applicant-what-other-names-have-you-used': 'Other names',
                                    'p-applicant-enter-your-date-of-birth': 'Date of birth',
                                    'p-applicant-british-citizen-or-eu-national':
                                        'Are you a British citizen or EU National?'
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
                                    'p-offender-do-you-have-contact-with-offender':
                                        'Do you have contact with the offender?',
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
                                title: 'Your injuries',
                                questions: {
                                    'p-applicant-infections':
                                        'Do you have HIV, hepatitis or an STI?',
                                    'p-applicant-non-sa-infections':
                                        'Do you have HIV or hepatitis?',
                                    'p-applicant-select-infections':
                                        'Select what infection you have',
                                    'p-applicant-select-non-sa-infections':
                                        'Select what infection you have',
                                    'p-applicant-pregnancy': 'Did you become pregnant?',
                                    'p-applicant-pregnancy-loss': 'Did you lose a pregnancy?',
                                    'p-applicant-are-you-claiming-for-physical-injuries':
                                        'Do you have physical injuries?',
                                    'p-applicant-physical-injury': 'What was injured?',
                                    'p-applicant-physical-injury-upper':
                                        'What parts of the head, face or neck were injured?',
                                    'p-applicant-physical-injury-upper-head':
                                        'Head or brain injuries',
                                    'p-applicant-physical-injury-upper-face': 'Face injuries',
                                    'p-applicant-physical-injury-upper-neck': 'Neck injuries',
                                    'p-applicant-physical-injury-upper-eye':
                                        'Eye or eyesight injuries',
                                    'p-applicant-physical-injury-upper-ear':
                                        'Ear or hearing injuries',
                                    'p-applicant-physical-injury-upper-nose': 'Nose injuries',
                                    'p-applicant-physical-injury-upper-mouth': 'Mouth injuries',
                                    'p-applicant-physical-injury-upper-skin':
                                        'Skin on your head, face or neck injuries',
                                    'p-applicant-physical-injury-upper-muscle':
                                        'Tissue on your head, face or neck injuries',
                                    'p-applicant-physical-injury-torso': 'Torso injuries',
                                    'p-applicant-physical-injury-torso-shoulder':
                                        'Shoulder injuries',
                                    'p-applicant-physical-injury-torso-chest': 'Chest injuries',
                                    'p-applicant-physical-injury-torso-abdomen': 'Abdomen injuries',
                                    'p-applicant-physical-injury-torso-back': 'Back injuries',
                                    'p-applicant-physical-injury-torso-pelvis': 'Pelvis injuries',
                                    'p-applicant-physical-injury-torso-genitals':
                                        'Genital injuries',
                                    'p-applicant-physical-injury-torso-skin': 'Torso injuries',
                                    'p-applicant-physical-injury-torso-muscle':
                                        'Tissue on your torso injuries',
                                    'p-applicant-physical-injury-arms':
                                        'What parts of the arms or hands were injured?',
                                    'p-applicant-physical-injury-arms-shoulder':
                                        'Shoulder injuries',
                                    'p-applicant-physical-injury-arms-arm': 'Arm injuries',
                                    'p-applicant-physical-injury-arms-elbow': 'Elbow injuries',
                                    'p-applicant-physical-injury-arms-wrist': 'Wrist injuries',
                                    'p-applicant-physical-injury-arms-hand': 'Hand injuries',
                                    'p-applicant-physical-injury-arms-digit':
                                        'Finger or thumb injuries',
                                    'p-applicant-physical-injury-arms-skin':
                                        'Skin on your arms or hands injuries',
                                    'p-applicant-physical-injury-arms-muscle':
                                        'Tissue on your arms injuries',
                                    'p-applicant-physical-injury-legs':
                                        'What parts of the legs or feet were injured?',
                                    'p-applicant-physical-injury-legs-hip': 'Hip injuries',
                                    'p-applicant-physical-injury-legs-leg': 'Leg injuries',
                                    'p-applicant-physical-injury-legs-knee': 'Knee injuries',
                                    'p-applicant-physical-injury-legs-ankle': 'Ankle injuries',
                                    'p-applicant-physical-injury-legs-foot': 'Foot injuries',
                                    'p-applicant-physical-injury-legs-toes': 'Toe injuries',
                                    'p-applicant-physical-injury-legs-skin':
                                        'Skin on your legs or feet injuries',
                                    'p-applicant-physical-injury-legs-muscle':
                                        'Tissue on your legs injuries',
                                    'p-applicant-do-you-have-disabling-mental-injury':
                                        'Do you have a disabling mental injury?',
                                    'p-applicant-mental-injury-duration':
                                        'Has your mental injury lasted 6 weeks or more?',
                                    'p-applicant-select-treatments':
                                        "Select any mental health treatments you've had",
                                    'p-applicant-affect-on-daily-life-dmi':
                                        'Briefly say how the crime has affected your daily life'
                                }
                            },
                            {
                                title: 'Your medical details',
                                questions: {
                                    'p-applicant-treatment-for-physical-injuries':
                                        'Treatment for your physical injuries',
                                    'p-applicant-select-treatments': 'Mental health treatments',
                                    'p-applicant-has-your-treatment-finished-dmi':
                                        'Have you finished your treatment?',
                                    'p-applicant-are-you-registered-with-gp':
                                        'Are you registered with a GP practice?',
                                    'p-applicant-have-you-seen-a-gp':
                                        'Have you seen a GP about your injuries?',
                                    'p-gp-enter-your-address': "GP's address",
                                    'p-applicant-medical-help': 'Did you seek other medical help?',
                                    'p-applicant-treatment-address':
                                        'Where did you have treatment?',
                                    'p-dentist-visited':
                                        'Have you seen a dentist about your injuries?',
                                    'p-dentist-details': "What is your dentist's address?",
                                    'p-applicant-dentist-visited':
                                        'Have you seen a dentist about your injuries?',
                                    'p-applicant-dentist-address': "What is your dentist's address?"
                                }
                            },
                            {
                                title: 'Money',
                                questions: {
                                    'p-applicant-unable-to-work-duration':
                                        'Have you been unable to work for more than 28 weeks?',
                                    'p-applicant-job-when-crime-happened':
                                        'Did you have a job when the crime happened?',
                                    'p-applicant-work-details-option':
                                        'Reason for not having paid work',
                                    'p-applicant-expenses': 'Expenses'
                                }
                            },
                            {
                                title: 'Other compensation',
                                questions: {
                                    'p-applicant-have-you-applied-to-us-before':
                                        'Have you applied before?',
                                    'p-applicant-have-you-applied-for-or-received-any-other-compensation':
                                        'Have you applied for or received any other form of compensation?',
                                    'p-applicant-who-did-you-apply-to': 'Who did you apply to?',
                                    'p-applicant-has-a-decision-been-made':
                                        'Have they made a decision?',
                                    'p-applicant-how-much-was-award': 'How much was the award?',
                                    'p-applicant-when-will-you-find-out': 'When will you find out?',
                                    'p-applicant-other-compensation-details':
                                        'Details of other compensation received',
                                    'p-applicant-applied-for-other-compensation-briefly-explain-why-not':
                                        'Why you have not applied for or received any other form of compensation'
                                }
                            },
                            {
                                title: 'Contact details',
                                questions: {
                                    'p-applicant-enter-your-address': 'Address',
                                    'p-applicant-enter-your-email-address': 'Email address',
                                    'p-applicant-enter-your-telephone-number': 'Telephone Number'
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
                            other: 'Other',
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
                            text: 'Text message to',
                            cbt: 'CBT',
                            emdr: 'EMDR',
                            antidepressants: 'Antidepressants',
                            counselling: 'counselling',
                            psychotherapy: 'psychotherapy',
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
                            10000295: 'Wiltshire Constabulary',
                            'phyinj-001': 'Burns on head, face or neck',
                            'phyinj-002': 'Scars on head, face or neck',
                            'phyinj-003': 'Brain damage',
                            'phyinj-004': 'Epilepsy',
                            'phyinj-005': 'Nerve damage on Arm',
                            'phyinj-006': 'Broken ear bone',
                            'phyinj-007': 'Hearing loss',
                            'phyinj-008': 'Loss of ear',
                            'phyinj-009': '1 perforated eardrum',
                            'phyinj-010': '2 perforated eardrums',
                            'phyinj-011': 'Tinnitus',
                            'phyinj-012': 'Injury affecting balance',
                            'phyinj-013': 'Broken eye socket',
                            'phyinj-014': 'Temporary blurred or double vision',
                            'phyinj-015': 'Permanent blurred or double vision',
                            'phyinj-016': 'Cataract',
                            'phyinj-017': 'Scratched eye',
                            'phyinj-018': 'Permanent loss of peripheral vision',
                            'phyinj-019': 'Dislocated lens',
                            'phyinj-020': 'Glaucoma',
                            'phyinj-021': 'Bleeding in eye',
                            'phyinj-022': 'Loss of eye',
                            'phyinj-023': 'Blindness',
                            'phyinj-024': 'Sight loss',
                            'phyinj-025': 'Floater',
                            'phyinj-026': 'Damaged or detached retina',
                            'phyinj-027': 'Punctured eyeball',
                            'phyinj-028': 'Damaged eye drain',
                            'phyinj-029': 'Clicking jaw',
                            'phyinj-030': 'Dislocated jaw',
                            'phyinj-031': 'Broken ethmoid (bone at base of nose)',
                            'phyinj-032': 'Broken ethmoid (bone at base of nose) needing operation',
                            'phyinj-033': 'Broken nose',
                            'phyinj-034': 'Broken jaw',
                            'phyinj-035': 'Face fractures',
                            'phyinj-036': 'Face numbness',
                            'phyinj-037': 'Broken cheekbone',
                            'phyinj-038': 'Broken hyoid (throat bone)',
                            'phyinj-039': 'Whiplash',
                            'phyinj-040': 'Loss of smell or taste',
                            'phyinj-041': 'Loss of nose',
                            'phyinj-042': 'Fractured skull',
                            'phyinj-043': 'Damaged or broken teeth',
                            'phyinj-044': 'Loose teeth',
                            'phyinj-045': 'Difficulty speaking',
                            'phyinj-046': 'Permanent loss of speech',
                            'phyinj-047': 'Loss of tongue',
                            'phyinj-048': 'Cuts on head, face or neck',
                            'phyinj-049': 'Bruises on head, face or neck',
                            'phyinj-050': 'Muscle on head, face or neck',
                            'phyinj-051': 'Black eye',
                            'phyinj-052': 'Bloody nose',
                            'phyinj-053': 'Hair pulled out',
                            'phyinj-054': 'Burns on torso',
                            'phyinj-055': 'Scars on torso',
                            'phyinj-056': 'Keyhole surgery on torso',
                            'phyinj-057': 'Chest surgery',
                            'phyinj-058': 'Stoma',
                            'phyinj-059': 'Broken vertebra',
                            'phyinj-060': 'Slipped disc',
                            'phyinj-061': 'Back strain',
                            'phyinj-062': 'Separated shoulder',
                            'phyinj-063': 'Broken collarbone',
                            'phyinj-064': 'Broken tailbone',
                            'phyinj-065': 'Genital injury',
                            'phyinj-066': 'Infertility',
                            'phyinj-067': 'Hernia',
                            'phyinj-068': 'Loss of kidney',
                            'phyinj-069': 'Kidney damage',
                            'phyinj-070': 'Punctured lung',
                            'phyinj-071': 'Collapsed lung',
                            'phyinj-072': 'Lung damage from smoke or chemicals',
                            'phyinj-073': 'Loss of pancreas',
                            'phyinj-074': 'Broken pelvis',
                            'phyinj-075': 'Broken rib',
                            'phyinj-076': 'Broken shoulder blade',
                            'phyinj-077': 'Loss of spleen',
                            'phyinj-078': 'Broken breast bone',
                            'phyinj-079': 'Cuts on torso',
                            'phyinj-080': 'Bruises on torso',
                            'phyinj-081': 'Muscle, ligament, or tendon on torso',
                            'phyinj-082': 'Burns on arm or hand',
                            'phyinj-083': 'Scars on arm or hand',
                            'phyinj-084': 'Loss of arm',
                            'phyinj-085': 'Paralysed arm',
                            'phyinj-086': 'Dislocated elbow',
                            'phyinj-087': 'Broken elbow',
                            'phyinj-088': 'Dislocated finger on one hand',
                            'phyinj-089': 'Dislocated fingers on both hands',
                            'phyinj-090': 'Broken thumb',
                            'phyinj-091': 'Broken index finger',
                            'phyinj-092': 'Broken finger on one hand',
                            'phyinj-093': 'Broken fingers on both hands',
                            'phyinj-094': 'Loss of finger',
                            'phyinj-095': 'Loss of part of finger',
                            'phyinj-096': 'Broken hand',
                            'phyinj-097': 'Loss of use of hand',
                            'phyinj-098': 'Loss of grip',
                            'phyinj-099': 'Broken arm',
                            'phyinj-100': 'Dislocated shoulder',
                            'phyinj-101': 'Frozen shoulder',
                            'phyinj-103': 'Muscle, ligament, or tendon on arm or hand',
                            'phyinj-104': 'Broken wrist',
                            'phyinj-105': 'Sprained wrist',
                            'phyinj-106': 'Loss of fingernail',
                            'phyinj-107': 'Cuts on arm or hand',
                            'phyinj-108': 'Bruises on arm or hand',
                            'phyinj-109': 'Dislocated index finger',
                            'phyinj-110': 'Dislocated thumb',
                            'phyinj-111': 'Loss of thumb',
                            'phyinj-112': 'Burns on legs or feet',
                            'phyinj-113': 'Scars on legs or feet',
                            'phyinj-114': 'Dislocated ankle',
                            'phyinj-115': 'Broken ankle',
                            'phyinj-116': 'Sprained ankle',
                            'phyinj-117': 'Broken leg',
                            'phyinj-118': 'Broken foot',
                            'phyinj-119': 'Broken heel',
                            'phyinj-120': 'Dislocated hip',
                            'phyinj-121': 'Broken hip',
                            'phyinj-122': 'Keyhole surgery to leg',
                            'phyinj-123': 'Dislocated kneecap',
                            'phyinj-124': 'Broken kneecap',
                            'phyinj-125': 'Removal of kneecap',
                            'phyinj-126': 'Amputated leg',
                            'phyinj-127': 'Paralysed leg',
                            'phyinj-129': 'Broken big toe',
                            'phyinj-130': 'Broken toe',
                            'phyinj-131': 'Amputated big toe',
                            'phyinj-132': '1 amputated toe',
                            'phyinj-133': '2 or more amputated toes',
                            'phyinj-134': 'Cuts on legs or feet',
                            'phyinj-135': 'Bruises on legs or feet',
                            'phyinj-136': '2 or more broken toes',
                            'phyinj-137': 'Hemiplegia (paralysis of one side of the the body)',
                            'phyinj-138': 'Paraplegia (paralysis of lower half of the body)',
                            'phyinj-139': 'Quadriplegia or tetraplegia (paralysis of all 4 limbs)',
                            'phyinj-140': 'Loss of pregnancy',
                            'phyinj-141': 'HIV',
                            'phyinj-142': 'Hepatitis B',
                            'phyinj-143': 'Hepatitis C',
                            'phyinj-144': 'Pregnancy',
                            'phyinj-145': 'Sexually transmitted infection (STI)',
                            'phyinj-146':
                                'Head injury causing concussion, headaches or loss of balance',
                            'phyinj-147': 'Paralysed finger',
                            'phyinj-148': 'Paralysed toe',
                            'phyinj-149': 'Other',
                            'phyinj-150': 'Injury affecting eye movement',
                            'phyinj-151': 'Ligament on head, face or neck',
                            'phyinj-152': 'Tendon on head, face or neck',
                            'phyinj-153': 'Cartilage on head, face or neck',
                            'phyinj-154': 'Muscle on torso',
                            'phyinj-155': 'Ligament on torso',
                            'phyinj-156': 'Tendon on torso',
                            'phyinj-157': 'Cartilage on torso',
                            'phyinj-158': 'Muscle on arm or hand',
                            'phyinj-159': 'Ligament on arm or hand',
                            'phyinj-160': 'Tendon on arm or hand',
                            'phyinj-161': 'Cartilage on arm or hand',
                            'phyinj-162': 'Paralysed foot',
                            'phyinj-164': 'Muscle on Leg or foot',
                            'phyinj-165': 'Ligament on Leg or foot',
                            'phyinj-166': 'Tendon on Leg or foot',
                            'phyinj-167': 'Cartilage on Leg or foot',
                            'phyinj-168': 'Nerve damage on Hand',
                            'phyinj-169': 'Nerve damage on Leg',
                            'phyinj-170': 'Nerve damage on Foot',
                            upper: 'Head or brain',
                            torso: 'Torso',
                            arms: 'Arms',
                            legs: 'Legs',
                            head: 'Head',
                            face: 'Face',
                            eye: 'Eye',
                            ear: 'Ear',
                            nose: 'Nose',
                            mouth: 'Mouth',
                            neck: 'Neck',
                            skin: 'Skin',
                            muscle: 'Tissue',
                            shoulder: 'Shoulder',
                            chest: 'Chest',
                            abdomen: 'Abdomen',
                            back: 'Back',
                            pelvis: 'Pelvis',
                            genitals: 'Genitals',
                            arm: 'Arm',
                            elbow: 'Elbow',
                            wrist: 'Wrist',
                            hand: 'Hand',
                            digit: 'Finger and Thumb',
                            hip: 'Hip',
                            leg: 'Leg',
                            knee: 'Knee',
                            ankle: 'Ankle',
                            foot: 'Foot',
                            toes: 'Toes',
                            aids: 'Buying or repairing physical aids',
                            alterations: 'Alterations to my home',
                            'home-care': 'Home care',
                            treatment: "NHS treatment I've paid for",
                            'no-expenses': 'I have not had these expenses',
                            employed:
                                'I had been in regular work for at least 3 years before the crime',
                            'underage-for-work': 'I was too young to work',
                            education: 'I was in full-time education',
                            care: 'I was caring for someone'
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
                        autoComplete: 'address-line2'
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
    'p--confirmation': {
        options: {
            pageContext: 'confirmation',
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
    },
    'p-applicant-declaration': {
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
                'q-gp-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-gp-building-and-street2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-gp-building-and-street',
                'q-gp-building-and-street2',
                'q-gp-town-or-city',
                'q-gp-county',
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
                'q-applicant-treatment-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-treatment-building-and-street2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-treatment-building-and-street',
                'q-applicant-treatment-building-and-street2',
                'q-applicant-treatment-town-or-city',
                'q-applicant-treatment-county',
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
                'q-applicant-dentist-address-building-and-street': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                },
                'q-applicant-dentist-address-building-and-street2': {
                    options: {
                        macroOptions: {
                            classes: ''
                        }
                    }
                }
            },
            outputOrder: [
                'q-applicant-dentist-address-building-and-street',
                'q-applicant-dentist-address-building-and-street2',
                'q-applicant-dentist-address-town-or-city',
                'q-applicant-dentist-address-county',
                'q-applicant-dentist-address-postcode'
            ]
        }
    },
    'p-applicant-you-cannot-get-compensation-violent-crime': {
        options: {
            buttonText: 'Continue anyway'
        }
    }
};
