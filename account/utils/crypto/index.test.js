'use strict';

const crypto = require('crypto');
const createCryptoService = require('./index');

jest.mock('crypto', () => {
    return {
        randomBytes: jest.fn(() => {
            return Buffer.from('some Bytes');
        }),
        createCipheriv: jest.fn(() => {
            return {
                update: jest.fn(() => {
                    return Buffer.from('some cipher');
                }),
                final: jest.fn(() => {
                    return Buffer.from('some cipher');
                })
            };
        })
    };
});

describe('Crypto Service', () => {
    const cryptoService = createCryptoService();
    it('should encrypt a string', () => {
        cryptoService.encrypt('foobar');
        expect(crypto.randomBytes).toHaveBeenCalledTimes(1);
        expect(crypto.createCipheriv).toHaveBeenCalledTimes(1);
    });
});
