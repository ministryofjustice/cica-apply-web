'use strict';

const createJwtService = require('.');

const token = {
    aud: 'http://www.aud.com',
    iss: 'http://www.iss.com',
    sub: 'http://www.sub.com',
    exp: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
    jti: 'uuid',
    iat: Date.now()
};

describe('jwtService', () => {
    it('Should sign and decode given data', () => {
        const jwtService = createJwtService();
        const jwt = jwtService.generateJWT(token);
        const result = jwtService.decodeJWT(jwt);
        expect(result).toEqual(token);
    });
});
