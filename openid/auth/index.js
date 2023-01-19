'use strict';

const {Issuer, generators} = require('openid-client');

function createAuthService(req) {
    let client;
    async function discover() {
        try {
            return await Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);
        } catch (error) {
            throw new Error(error);
        }
    }

    async function getClient() {
        const issuer = await discover();
        client = new issuer.Client(
            {
                client_id: process.env.CW_GOVUK_CLIENT_ID,
                // client_secret: process.env.CW_GOVUK_PRIVATE_KEY,
                redirect_uri: `${process.env.CW_URL}/account/signed-in`,
                response_types: ['code'],
                // post_logout_redirect_uris: [`${process.env.CW_URL}/account/signed-out`],
                token_endpoint_auth_method: issuer.token_endpoint_auth_methods_supported[0],
                // // jwks_uri: issuer.jwks_uri,
                // token_endpoint: issuer.token_endpoint
                // token_endpoint_auth_signing_alg_values_supported:
                //     issuer.token_endpoint_auth_signing_alg_values_supported
            },
            {
                keys: [
                    {
                        kty: 'RSA',
                        kid: 'j0GwKEJkeWIIG9tF9qHkJ8N6Ne8OZZffa6h3Tx-IUCY',
                        n:
                            '4MwJMUaiiuLZXZZwFWfjdvtpFeUVdBUgRKRlBW5UqVcmR7ee9FZJjmYM2TNVx-5cHp0ilcTo0mv96aLnGLeT8l6T1oNbeNYg2Ot7Z_6oyyqNeizt9n58GkKIowsabJrtFIVDdr3OoQ1YTgkhYTNKSxSXSF2X-VOwuh0KnuxrQdWs_l1um7kowxRJPTHFKeSPgaG-0NQ4dRvpnHTWyD6pqzeezEopphXTjSIQQkKfRUiHgX-JPK0-Gp06pRQDTC3be0HGA9GOdnxdPOu4N9Z8bjs8zF5FdCre3TVX5vg6S0EdnOFqkpsWTmCdQ61Q8RLbc1tHF2Z-21pVufhYJHPu3w',
                        e: 'AQAB',
                        d:
                            'G0Fh0_Gmf4Rlqm01BcNk1uZApYDzCvIMyYXNIc1wwl9oqsVepm1X2cYRxLvuqKED1kpjCRmoyOqDDLLNpjeL3pUNA7NFge8kaGiUu9UqjgeIw8lyyLIpRd3PR0VvXL-kAxrtRRZaWTiO_lcpDunzFgtXFFUUugwln0sqIH61unN9qvfMzsCzswYlAFyLKT3rIVjlUPyVSgJMEvMNxbPj3lQZRNEf0eM7VSIl55J0JKaIV5hPqnmIVuzCbvRMtZTbf5ige_pYtBcZu2d93ruVpVWAwHDakOjupZVa9ZmcL6kgVeYyHodRVHAJJWKxt7LQuvHcs-T0I-Ohjf9GYOc58Q',
                        p:
                            '8snU8nzioAShB5Y7DgptPfQ9taDmnQNBUI2T7PgsURtYHZqaWHvv9bNXAfp5w1xpk50jzG_PID5vviT9DlsvrOVtuE8pbo8R-dJxHbCl9hT50ofACU95mIunguNSpfMF5rGrQ53-BE6elW3YJRR6W1dGA3IDm7S9uL3Qv-IrPSs',
                        q:
                            '7QeTH7P0zdO4AflkAym9q2X0q8KmVVIJT39o-gaor7xFES06ZWWWZScAwtYLn28hrOFwDu3y1qUM5yY-Zt29pdb3z_UhHIoOQIpVtK5yr_Gr7F0uNu6E1DAMPGbLN2N3Ex_WdzfWW4b2fnqIlkuqE81jkGVZWY4aBYKrB6lDgx0',
                        dp:
                            'SVnhFEHW1jGP1RL2VI-h4Y3g9vbdtaI-IXAkuPthqD9yp78F0qXfIYRFTTu3feZ1nztijWlaUouKhw_1xFiYVswaEg0Yn2ZqL-f8dNPh0C8WKx0IT8fLHONUgJ7dYXXC2qfi7lLVY8e88bh2DP3a2a3MYU4Y-PnqN95hKxfRqHE',
                        dq:
                            'iSoZ_H2iC74aPKI6Ow5boSUWCpNQuA0KMEP11sIludSET2VR5r1747tHWHiPL0sbPLUUqL8QCSBoMBdUgyiMh7y3mVMsPxyxFK443J8a5TBAIj7l8Inkufm4CvgdX0ci8CE7dbANTtfyKszz362XlXAEztmndAikjE3KdVuBIw0',
                        qi:
                            '10FTacKKO3JFm0bBImJGYn-1RrbarCSxBLMJz4e91nxfQ43pycePOqHrqh5lxXsanZhSQxhnxIyB8LaJzhb8BulDL6rJL3jtHmKUPKpjPAeva-ilPIPhCHIMtQ6x4pu990kqI_DlSvYFxpwslVnIFt6SqfdXD01dRoottfvupmQ'
                    }
                ]
            }
        );
        return client;
        // const params = client.callbackParams(req);
        // const nonce = '';
        // return client.callback(`${process.env.CW_URL}/account/signed-in`, params, {nonce});
    }

    async function getAuthorisationUri(params) {
        client = client || (await getClient(req));
        // const codeVerifier = generators.codeVerifier();
        // req.session.codeVerifier = codeVerifier;

        // const codeChallenge = generators.codeChallenge(codeVerifier);
        return client.authorizationUrl({
            scope: 'openid',
            // resource: 'https://my.api.example.com/resource/32178',
            // code_challenge: codeChallenge,
            // code_challenge_method: 'S256',
            ...params
        });
    }
    return Object.freeze({
        discover,
        getAuthorisationUri,
        getClient
    });
}

module.exports = createAuthService;
