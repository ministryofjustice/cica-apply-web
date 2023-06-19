'use strict';

function isQuestionnaireInstantiated(sessionData) {
    const questionnaireId = sessionData?.questionnaireId;
    return !!questionnaireId;
}

module.exports = isQuestionnaireInstantiated;
