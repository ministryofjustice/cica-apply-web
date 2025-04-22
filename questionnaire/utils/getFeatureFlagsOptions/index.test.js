'use strict';

const getFeatureFlagsOptions = require('.');

const validToken = 'b2a86644-e996-4abf-8ef1-2dc3458fff17';

describe('getFeatureFlagsOptions', () => {
    describe('No cookie provided', () => {
        it('Should return undefined values', () => {
            const cookies = {};
            const result = getFeatureFlagsOptions(cookies);
            expect(result).toEqual({
                templateName: undefined,
                templateVersion: undefined
            });
        });
    });

    describe('Malformed cookie value', () => {
        it('Should throw BadRequest error', () => {
            const cookies = {
                featureFlags: '{"invalidJson": true'
            };

            expect(() => getFeatureFlagsOptions(cookies)).toThrow('Malformed featureFlags cookie');
        });
    });

    describe('Invalid bearer token', () => {
        it('Should throw UnauthorizedError', () => {
            const cookies = {
                featureFlags: JSON.stringify({
                    templateName: 'custom-template',
                    templateVersion: 'v1.2.3',
                    bearerAuth: 'invalid-token'
                })
            };
            expect(() => getFeatureFlagsOptions(cookies)).toThrow(
                'Invalid bearer token in featureFlags cookie'
            );
        });
    });

    describe('Valid bearer token', () => {
        it('Should return requested template name and version', () => {
            const cookies = {
                featureFlags: JSON.stringify({
                    templateName: 'custom-template',
                    templateVersion: 'v1.2.3',
                    bearerAuth: validToken
                })
            };
            const result = getFeatureFlagsOptions(cookies);
            expect(result).toEqual({
                templateName: 'custom-template',
                templateVersion: 'v1.2.3'
            });
        });

        it('Should return undefined when template values are missing', () => {
            const cookies = {
                featureFlags: JSON.stringify({
                    bearerAuth: validToken
                })
            };
            const result = getFeatureFlagsOptions(cookies);
            expect(result).toEqual({
                templateName: undefined,
                templateVersion: undefined
            });
        });
    });
});
