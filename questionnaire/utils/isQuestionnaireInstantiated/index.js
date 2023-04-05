'use strict';

function isQuestionnaireInstantiated(sessionData) {
    const questionnaireId = sessionData?.questionnaireId;
    return questionnaireId || false;
}

module.exports = isQuestionnaireInstantiated;
