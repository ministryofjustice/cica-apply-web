/* eslint-disable global-require */

'use strict';

const getSignInReturnToURI = require('.');

const SESSION_WITH_QUESTIONNAIRE_ID = {questionnaireId: 'c56a50ae-6333-4f91-868a-f45a32afdb49'};
const SESSION_WITHOUT_QUESTIONNAIRE_ID = {};

describe('getSignInReturnToURI', () => {
    describe('Questionnaire id in session', () => {
        it('Should return the success URI', () => {
            const result = getSignInReturnToURI(SESSION_WITH_QUESTIONNAIRE_ID);
            expect(result).toBe('/account/sign-in/success');
        });
    });
    describe('Questionnaire id not in session', () => {
        it('Should return the referrer', () => {
            const result = getSignInReturnToURI(SESSION_WITHOUT_QUESTIONNAIRE_ID);
            expect(result).toBe('/account/dashboard');
        });
    });
});
