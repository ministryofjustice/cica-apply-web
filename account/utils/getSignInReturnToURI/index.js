'use strict';

const getQuestionnaireIdInSession = require('../../../questionnaire/utils/getQuestionnaireIdInSession');
const {getDashboardURI} = require('../getActionURIs');

function getSignInReturnToURI(session) {
    const questionnaireId = getQuestionnaireIdInSession(session);
    if (questionnaireId) {
        return '/account/sign-in/success';
    }
    return getDashboardURI(true);
}

module.exports = getSignInReturnToURI;
