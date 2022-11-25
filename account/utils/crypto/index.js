'use strict';

const crypto = require('crypto');

function createCryptoService() {
    const defaults = {
        algorithm: 'aes-256-ctr',
        secretKey: process.env.CW_NONCE_SIGNER
    };

    function encrypt(text, algorithm = defaults.algorithm, secretKey = defaults.secretKey) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    }

    return Object.freeze({
        encrypt
    });
}

module.exports = createCryptoService;
