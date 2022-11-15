'use strict';

const oid = require('openid-client');
const createIssuerService = require('./index');

jest.mock('openid-client', () => {
    return {
        Issuer: {
            discover: jest.fn()
        }
    };
});

describe('Issuer service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should contact the issuer service', async () => {
        const issuerService = createIssuerService();
        const issuer = await issuerService.identify();
        expect(issuer).toEqual(undefined);
        expect(oid.Issuer.discover).toHaveBeenCalledTimes(1);
    });
});
