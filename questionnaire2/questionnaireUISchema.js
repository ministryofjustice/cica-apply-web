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
                }
            }
        }
    }
};
