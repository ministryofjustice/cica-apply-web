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
        expect(result.channel).toBe('telephone');
        expect(result.sourceIp).toBe('1.0.0.0');
    });
    it('Should identify the clients IP from connection.remoteAddress and return "telephone"', () => {
        request.connection.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result.channel).toBe('telephone');
        expect(result.sourceIp).toBe('1.0.0.0');
    });
    it('Should identify the clients IP from connection.socket.remoteAddress and return "telephone"', () => {
        request.connection.socket.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result.channel).toBe('telephone');
        expect(result.sourceIp).toBe('1.0.0.0');
    });
    it('Should identify the clients IP from socket.remoteAddress and return "telephone"', () => {
        request.socket.remoteAddress = '1.0.0.0';
        const result = getOwnerOrigin(request, false);
        expect(result.channel).toBe('telephone');
        expect(result.sourceIp).toBe('1.0.0.0');
    });
    describe('Owner is unauthenticated', () => {
        it('Should return "web" if the clientIP is not in the internalIpArray', () => {
            request.headers['x-forwarded-for'] = '1.0.0.1';
            request.connection.remoteAddress = '1.0.0.2';
            request.connection.socket.remoteAddress = '1.0.0.3';
            request.socket.remoteAddress = '1.0.0.4';
            const result = getOwnerOrigin(request, false);
            expect(result.channel).toBe('web');
            expect(result.sourceIp).toBe('');
        });
        it('Should return "web" if the clientIP is not found', () => {
            const result = getOwnerOrigin(request, false);
            expect(result.channel).toBe('web');
            expect(result.sourceIp).toBe('');
        });
    });
    describe('Owner is authenticated', () => {
        it('Should return "dashboard" if the clientIP is not in the internalIpArray', () => {
            request.headers['x-forwarded-for'] = '1.0.0.1';
            request.connection.remoteAddress = '1.0.0.2';
            request.connection.socket.remoteAddress = '1.0.0.3';
            request.socket.remoteAddress = '1.0.0.4';
            const result = getOwnerOrigin(request, true);
            expect(result.channel).toBe('dashboard');
            expect(result.sourceIp).toBe('');
        });
        it('Should return "web" if the clientIP is not found', () => {
            const result = getOwnerOrigin(request, true);
            expect(result.channel).toBe('dashboard');
            expect(result.sourceIp).toBe('');
        });
    });
});
