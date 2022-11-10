'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
// const jwksRsa = require('jwks-rsa');

// const createIssuerService = require('../issuer');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../stuff/private_key.pem'));

function createJwtService() {
    function generateJWT(tokenContents) {
        return jwt.sign(tokenContents, privateKey, {algorithm: 'RS256'});
    }

    function decodeJWT(token) {
        return jwt.decode(token);
    }

    // https://traveling-coderman.net/code/node-architecture/authentication/
    async function verifyJWT(token) {
        return token; // temp
        // const issuerService = createIssuerService();
        // const uri = await issuerService.getJwtKeysUri();
        // console.log('11111111111111111111111111');
        // console.log({token});
        // const jwksClient = jwksRsa({
        //     jwksUri: uri
        // });

        // console.log('22222222222222222222222222222222');
        // const decodedToken = decodeJWT(token);
        // console.log({decodedToken});
        // console.log('333333333333333333333333333333333');
        // if (!decodedToken) {
        //     throw Error('Incorrectly structured, or invalid token');
        // }
        // console.log('444444444444444444444444444444444');
        // console.log(decodedToken.kid);
        // const signingKey = await jwksClient.getSigningKey(decodedToken.kid);
        // console.log('555555555555555555555555555555555555');
        // console.log({
        //     a: signingKey,
        //     b: signingKey.getPublicKey()
        // });
        // console.log('6666666666666666666666666666666666');
        // jwt.verify(token, signingKey.getPublicKey(), {
        //     algorithms: ['RS256']
        // });
        // console.log('77777777777777777777777777777');

        // // return jwt.verify(token, getKey, (err, decoded) => {
        // //     console.log(decoded);
        // // });

        // const jwksClient = jwksRsa({
        //     jwksUri: uri
        // });

        // function getKey(header, callback) {
        //     // console.log({header});
        //     jwksClient.getSigningKey(header.kid, (err, key) => {
        //         if (err) {
        //             // console.log(err);
        //             return;
        //         }
        //         const signingKey = key.publicKey || key.rsaPublicKey;
        //         callback(null, signingKey);
        //     });
        // }
        // let options;
        // jwt.verify(token, getKey, options, (err, decoded) => {
        //     // console.log(decoded);
        // });
    }

    return Object.freeze({
        generateJWT,
        decodeJWT,
        verifyJWT
    });
}

module.exports = createJwtService;
