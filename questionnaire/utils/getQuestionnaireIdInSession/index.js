'use strict';

function getQuestionnaireIdInSession(sessionData) {
    const questionnaireId = sessionData?.questionnaireId;
    return questionnaireId;
}

module.exports = getQuestionnaireIdInSession;
