'use strict';

const getOwnerOrigin = require('.');

let request = {};

beforeEach(() => {
    request = {
        headers: {
            'x-forwarded-for': undefined
        },
        connection: {
            remoteAddress: undefined,
            socket: {
                remoteAddress: undefined
            }
        },
        socket: {
            remoteAddress: undefined
        }
    };
});

describe('getOwnerOrigin', () => {
    it('Should identify the clients IP from the "x-forwarded-for" header and return "telephone"', () => {
        request.headers['x-forwarded-for'] = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result).toBe('telephone');
    });
    it('Should identify the clients IP from connection.remoteAddress and return "telephone"', () => {
        request.connection.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result).toBe('telephone');
    });
    it('Should identify the clients IP from connection.socket.remoteAddress and return "telephone"', () => {
        request.connection.socket.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result).toBe('telephone');
    });
    it('Should identify the clients IP from socket.remoteAddress and return "telephone"', () => {
        request.socket.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result).toBe('telephone');
    });
    describe('Owner is unauthenticated', () => {
        it('Should return "web" if the clientIP is not in the internalIpArray', () => {
            request.headers['x-forwarded-for'] = '1.0.0.1';
            request.connection.remoteAddress = '1.0.0.2';
            request.connection.socket.remoteAddress = '1.0.0.3';
            request.socket.remoteAddress = '1.0.0.4';
            const result = getOwnerOrigin(request, false);
            expect(result).toBe('web');
        });
        it('Should return "web" if the clientIP is not found', () => {
            const result = getOwnerOrigin(request, false);
            expect(result).toBe('web');
        });
    });
    describe('Owner is authenticated', () => {
        it('Should return "dashboard" if the clientIP is not in the internalIpArray', () => {
            request.headers['x-forwarded-for'] = '1.0.0.1';
            request.connection.remoteAddress = '1.0.0.2';
            request.connection.socket.remoteAddress = '1.0.0.3';
            request.socket.remoteAddress = '1.0.0.4';
            const result = getOwnerOrigin(request, true);
            expect(result).toBe('dashboard');
        });
        it('Should return "web" if the clientIP is not found', () => {
            const result = getOwnerOrigin(request, true);
            expect(result).toBe('dashboard');
        });
    });
});
