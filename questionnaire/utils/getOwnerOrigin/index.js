'use strict';

function getOwnerOrigin(request, isAuthenticated) {
    const internalIp = process.env.CW_INTERNAL_IP || '';
    const defaultSource = isAuthenticated ? 'dashboard' : 'web';
    const clientIp =
        request?.headers?.['x-forwarded-for'] ||
        request?.connection?.remoteAddress ||
        request?.socket?.remoteAddress ||
        request?.connection?.socket?.remoteAddress;

    return internalIp === clientIp ? 'telephone' : defaultSource;
}

module.exports = getOwnerOrigin;
