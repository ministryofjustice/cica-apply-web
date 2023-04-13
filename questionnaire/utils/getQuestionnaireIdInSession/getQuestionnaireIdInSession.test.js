'use strict';

const getQuestionnaireIdInSession = require('.');

const MOCKED_REQUEST_VALID = {
    session: {
        questionnaireId: 'c992d660-d1a8-4928-89a0-87d4f9640250'
    }
};
const MOCKED_REQUEST_INVALID = {
    session: {
        foo: 'bar'
    }
};

describe('getQuestionnaireIdInSession', () => {
    it('Should return a questionnaire id', () => {
        expect(getQuestionnaireIdInSession(MOCKED_REQUEST_VALID.session)).toBe(
            'c992d660-d1a8-4928-89a0-87d4f9640250'
        );
    });
    it('Should return undefined', () => {
        expect(getQuestionnaireIdInSession(MOCKED_REQUEST_INVALID.session)).toBe(undefined);
    });
});
