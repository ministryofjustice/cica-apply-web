'use strict';

const isQuestionnaireInstantiated = require('.');

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

describe('isQuestionnaireInstantiated', () => {
    it('Should return true', () => {
        expect(isQuestionnaireInstantiated(MOCKED_REQUEST_VALID.session)).toBe(
            'c992d660-d1a8-4928-89a0-87d4f9640250'
        );
    });
    it('Should return false', () => {
        expect(isQuestionnaireInstantiated(MOCKED_REQUEST_INVALID.session)).toBe(false);
    });
});
