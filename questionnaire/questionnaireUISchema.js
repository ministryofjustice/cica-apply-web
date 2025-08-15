'use strict';

module.exports = {
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
    // TODO: IS THIS REDUNDANT????? IT IS NOT IN THE TEMPLATE AND I CAN'T FIND MUCH HISTORY ON IT!
    'p-applicant-you-cannot-get-compensation-violent-crime': {
        options: {
            buttonText: 'Continue anyway'
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
    'p-applicant-se-home-care': {
        options: {
            outputOrder: ['q-applicant-se-home-care', 'help-understanding-care']
        }
    },
    'p-applicant-immediate-aftermath': {
        options: {
            outputOrder: ['q-applicant-immediate-aftermath', 'immediate-aftermath-info']
        }
    }
};
