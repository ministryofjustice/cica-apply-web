module.exports = {
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
    }
};
