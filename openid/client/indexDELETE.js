'use strict';

const {
    Issuer,
    // Strategy,
    generators
} = require('openid-client');

module.exports = async (res, req) => {
    const issuer = await Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);

    const client = new issuer.Client(
        {
            client_id: process.env.CW_GOVUK_CLIENT_ID,
            client_secret: process.env.CW_GOVUK_PRIVATE_KEY,
            redirect_uris: [`${process.env.CW_URL}/account/signed-in`],
            response_types: ['code'] // ,
            // post_logout_redirect_uris: [`${process.env.CW_URL}/account/signed-out`],
            // token_endpoint_auth_method: issuer.token_endpoint_auth_methods_supported[0],
            // // jwks_uri: issuer.jwks_uri,
            // token_endpoint: issuer.token_endpoint
        },
        {
            keys: [
                {
                    kty: 'RSA',
                    kid: 'j0GwKEJkeWIIG9tF9qHkJ8N6Ne8OZZffa6h3Tx-IUCY',
                    n:
                        '4MwJMUaiiuLZXZZwFWfjdvtpFeUVdBUgRKRlBW5UqVcmR7ee9FZJjmYM2TNVx-5cHp0ilcTo0mv96aLnGLeT8l6T1oNbeNYg2Ot7Z_6oyyqNeizt9n58GkKIowsabJrtFIVDdr3OoQ1YTgkhYTNKSxSXSF2X-VOwuh0KnuxrQdWs_l1um7kowxRJPTHFKeSPgaG-0NQ4dRvpnHTWyD6pqzeezEopphXTjSIQQkKfRUiHgX-JPK0-Gp06pRQDTC3be0HGA9GOdnxdPOu4N9Z8bjs8zF5FdCre3TVX5vg6S0EdnOFqkpsWTmCdQ61Q8RLbc1tHF2Z-21pVufhYJHPu3w',
                    e: 'AQAB'
                }
            ]
        }
    );

    const codeVerifier = generators.codeVerifier();
    // store the code_verifier in your framework's session mechanism, if it is a cookie based solution
    // it should be httpOnly (not readable by javascript) and encrypted.
    req.session.codeVerifier = codeVerifier;

    const codeChallenge = generators.codeChallenge(codeVerifier);

    client.authorizationUrl({
        scope: 'openid',
        redirect_uri: `${process.env.CW_URL}/account/signed-in`,
        // resource: 'https://my.api.example.com/resource/32178',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    });

    return client;
};
