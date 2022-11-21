'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
// const jwksClient = require('jwks-rsa');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../stuff/private_key.pem'));

function createJwtService() {
    function generateJWT(tokenContents) {
        return jwt.sign(tokenContents, privateKey, {algorithm: 'RS256'});
    }

    function verifyJTW(issuer, token, nonce) {
        /* const opts = {
            audience: process.env.CW_GOVUK_CLIENT_ID,
            issuer: issuer.issuer,
            nonce,
            algorithms: ['ES256']
        };

        const client = jwksClient({
            jwksUri: issuer.jwks_uri
        });

        function getKey(header, callback) {
            client.getSigningKey(header.kid, function(err, key) {
                if (err) {
                    throw err;
                }
                const signingKey = key.publicKey || key.rsaPublicKey;
                callback(null, signingKey);
            });
        }

        return jwt.verify(token, getKey, opts, (err, decoded) =>{
            if(err){
                return err
            }
            return decoded
        }); */

        console.log(nonce);

        return jwt.decode(token);
    }

    return Object.freeze({
        generateJWT,
        verifyJTW
    });
}

module.exports = createJwtService;
