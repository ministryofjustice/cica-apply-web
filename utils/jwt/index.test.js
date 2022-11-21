'use strict';

const jwt = require('jsonwebtoken');
const createJwtService = require('./index');

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => {
            return 'a signed token';
        }),
        decode: jest.fn(() => {
            return 'a decoded token';
        })
    };
});

describe('JWT service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const jwtService = createJwtService();
    it('Should sign a jwt', () => {
        const jwtoken = jwtService.generateJWT();
        expect(jwtoken).toEqual('a signed token');
        expect(jwt.sign).toHaveBeenCalledTimes(1);
    });
    it('Should verify a jwt', () => {
        const jwtoken = jwtService.verifyJTW();
        expect(jwtoken).toEqual('a decoded token');
        expect(jwt.decode).toHaveBeenCalledTimes(1);
    });
});
