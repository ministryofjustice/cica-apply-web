'use strict';

const createTokenService = require('./index');

jest.mock('../../../questionnaire/request-service', () => {
    return () => ({
        post: () => {
            return 'I am a token';
        }
    });
});

describe('Token service', () => {
    it('Should return "I am a token"', async () => {
        const tokenService = createTokenService();
        const token = await tokenService.getUserIdToken({});
        expect(token).toEqual('I am a token');
    });
});
