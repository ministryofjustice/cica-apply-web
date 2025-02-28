'use strict';

function getOwnerOrigin(request, isAuthenticated) {
    const internalIp = process.env.CW_INTERNAL_IP || '';
    const defaultSource = isAuthenticated ? 'dashboard' : 'web';
    const clientIp =
        request?.headers?.['x-forwarded-for'] ||
        request?.connection?.remoteAddress ||
        request?.socket?.remoteAddress ||
        request?.connection?.socket?.remoteAddress;

    const channel = internalIp === clientIp ? 'telephone' : defaultSource;
    const sourceIp = internalIp === clientIp ? internalIp : '';
    return {channel, sourceIp};
}

module.exports = getOwnerOrigin;
