module.exports = {
    'p-applicant-have-you-applied-to-us-before': {
        // transformer: 'form',
        options: {
            transformOrder: ['todo2', 'q-applicant-have-you-applied-to-us-before'],
            outputOrder: ['q-applicant-have-you-applied-to-us-before'],
            properties: {
                'q-applicant-have-you-applied-to-us-before': {
                    // transformer: 'govukRadios',
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: true,
                                componentIds: ['todo2']
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
                'todo',
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
                                componentIds: ['todo']
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
                'q-todo-who-have-you-applied-to',
                'q-todo-award-amount',
                'q-todo-find-out-about-award',
                'q-todo-decision-made'
            ],
            outputOrder: ['q-todo-who-have-you-applied-to', 'q-todo-decision-made'],
            properties: {
                'q-todo-decision-made': {
                    // transformer: 'govukRadios',
                    options: {
                        conditionalComponentMap: [
                            {
                                itemValue: false,
                                componentIds: ['q-todo-find-out-about-award']
                            },
                            {
                                itemValue: true,
                                componentIds: ['q-todo-award-amount']
                            }
                        ]
                    }
                }
            }
        }
    }
};
