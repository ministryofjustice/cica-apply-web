'use strict';

const pinoHttp = require('pino-http');
const {nanoid} = require('nanoid');

module.exports = pinoHttp({
    redact: [
        'req.headers.cookie',
        'req.headers.authorization',
        'req.headers["x-forwarded-for"]',
        'res.headers',
        'req.remoteAddress',
        'req.remotePort'
    ],
    genReqId: req => {
        const requestIdHeader = req.headers['x-request-id'];
        const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] : requestIdHeader;
        return requestId || nanoid();
    },
    customSuccessObject: (req, res, val) => ({
        ...val,
        questionnaireId: req.session?.questionnaireId,
        ownerId: req.session?.ownerId
    }),
    customErrorObject: (req, res, err, val) => ({
        ...val,
        questionnaireId: req.session?.questionnaireId,
        ownerId: req.session?.ownerId
    })
});
