'use strict';

const getRedirectionUrl = require('.');

describe('getRedirectionUrl', () => {
    describe('No questionnaireId supplied', () => {
        describe('Start type equals "start"', () => {
            it('Should return a valid start URL', () => {
                const type = 'start';
                const questionnaireId = undefined;
                const result = getRedirectionUrl(type, questionnaireId);
                expect(result).toBe('/apply/start');
            });
        });

        describe('Start type equals "resume"', () => {
            it('Should return a valid resume URL', () => {
                const type = 'resume';
                const questionnaireId = undefined;
                const result = getRedirectionUrl(type, questionnaireId);
                expect(result).toBe('/account/sign-in');
            });
        });

        describe('Start type equals "invalid"', () => {
            it('Should return undefined', () => {
                const type = 'invalid';
                const questionnaireId = undefined;
                const result = getRedirectionUrl(type, questionnaireId);
                expect(result).toBe(undefined);
            });
        });
    });
    describe('QuestionnaireId supplied, not authenticated', () => {
        describe('Start type equals "start"', () => {
            it('Should return a valid start URL', () => {
                const type = 'start';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, false);
                expect(result).toBe('/apply/start');
            });
        });

        describe('Start type equals "resume"', () => {
            it('Should return the sign-in URL, not the resume URL, because the session is not authenticated', () => {
                const type = 'resume';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, false);
                expect(result).toBe('/account/sign-in');
            });
        });

        describe('Start type equals "invalid"', () => {
            it('Should return undefined', () => {
                const type = 'invalid';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, false);
                expect(result).toBe(undefined);
            });
        });
    });

    describe('QuestionnaireId supplied, authenticated', () => {
        describe('Start type equals "start"', () => {
            it('Should return a valid start URL', () => {
                const type = 'start';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, true);
                expect(result).toBe('/apply/start');
            });
        });

        describe('Start type equals "resume"', () => {
            it('Should return a valid resume URL', () => {
                const type = 'resume';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, true);
                expect(result).toBe('/apply/resume/some-questionnaire-id');
            });
        });

        describe('Start type equals "invalid"', () => {
            it('Should return undefined', () => {
                const type = 'invalid';
                const questionnaireId = 'some-questionnaire-id';
                const result = getRedirectionUrl(type, questionnaireId, true);
                expect(result).toBe(undefined);
            });
        });
    });
});
