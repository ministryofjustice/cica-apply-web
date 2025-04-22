'use strict';

const getFeatureFlagOptions = require('.');
const validToken = 'b2a86644-e996-4abf-8ef1-2dc3458fff17';

describe('getFeatureFlagOptions', () => {
    describe('No cookie provided', () => {
        it('Should return default values', () => {
            const cookies = {};
            const result = getFeatureFlagOptions(cookies);
            expect(result).toEqual({
                templateName: 'sexual-assault',
                templateVersion: undefined
            });
        });
    });

    describe('Malformed cookie value', () => {
        it('Should throw BadRequest error', () => {
            const cookies = {
                featureFlag: '{"invalidJson": true'
            };

            try {
                getFeatureFlagOptions(cookies);
            } catch (err) {
                expect(err.name).toBe('BadRequest');
                expect(err.message).toBe('Malformed featureFlag cookie');
                expect(err.statusCode).toBe(400);
            }
        });
    });

    describe('Invalid bearer token', () => {
        it('Should throw UnauthorizedError', () => {
            const cookies = {
                featureFlag: JSON.stringify({
                    templateName: 'custom-template',
                    templateVersion: 'v1.2.3',
                    bearerAuth: 'invalid-token'
                })
            };
            try {
                getFeatureFlagOptions(cookies);
            } catch (err) {
                expect(err.name).toBe('UnauthorizedError');
                expect(err.message).toBe('Invalid bearer token in featureFlag cookie');
                expect(err.statusCode).toBe(401);
            }
        });
    });

    describe('Valid bearer token', () => {
        it('Should return requested template name and version', () => {
            const cookies = {
                featureFlag: JSON.stringify({
                    templateName: 'custom-template',
                    templateVersion: 'v1.2.3',
                    bearerAuth: validToken
                })
            };
            const result = getFeatureFlagOptions(cookies);
            expect(result).toEqual({
                templateName: 'sexual-assault',
                templateVersion: 'v1.2.3'
            });
        });

        it('Should fallback to defaults when template values are missing', () => {
            const cookies = {
                featureFlag: JSON.stringify({
                    bearerAuth: validToken
                })
            };
            const result = getFeatureFlagOptions(cookies);
            expect(result).toEqual({
                templateName: 'sexual-assault',
                templateVersion: undefined
            });
        });
    });
});
