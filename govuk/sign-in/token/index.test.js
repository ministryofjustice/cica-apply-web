'use strict';

describe('Token service', () => {
    beforeEach(() => {
        jest.doMock('../issuer/index', () =>
            jest.fn(() => ({
                identify: () => {
                    return {
                        token_endpoint: 'http://www.tokenendpoint.com'
                    };
                }
            }))
        );

        jest.doMock('../../../questionnaire/request-service', () =>
            jest.fn(() => ({
                post: () => ({
                    body: {
                        access_token: 'SlAV32hkKG',
                        refresh_token: 'i6mapTIAVSp2oJkgUnCACKKfZxt_H5MBLiqcybBBd04',
                        token_type: 'Bearer',
                        expires_in: 180,
                        id_token:
                            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzcyI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg'
                    }
                })
            }))
        );
    });

    it('Should get token data', async () => {
        // eslint-disable-next-line global-require
        const createTokenService = require('./index');
        const tokenService = createTokenService();
        const response = await tokenService.getTokenData('somecode');
        expect(response).toEqual({
            access_token: 'SlAV32hkKG',
            refresh_token: 'i6mapTIAVSp2oJkgUnCACKKfZxt_H5MBLiqcybBBd04',
            token_type: 'Bearer',
            expires_in: 180,
            id_token:
                'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzcyI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg'
        });
    });

    it('Should throw if authorisation code is missing', async () => {
        // eslint-disable-next-line global-require
        const createTokenService = require('./index');
        const tokenService = createTokenService();
        await expect(tokenService.getTokenData()).rejects.toThrow('Authorisation code is required');
    });
});
