'use strict';

function isQuestionnaireInstantiated(req) {
    const questionnaireId = req?.session?.questionnaireId;
    return !!questionnaireId;
}

module.exports = isQuestionnaireInstantiated;
