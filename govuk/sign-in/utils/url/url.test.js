'use strict';

const url = require('.');

describe('url', () => {
    it('Should build a url string', () => {
        const result = url.build('http://www.myurl.com');
        expect(result).toBe('http://www.myurl.com/');
    });

    it('Should build a url string with search', () => {
        const result = url.build('http://www.myurl.com', {
            search: {abc: 123, foo: 'bar'}
        });
        expect(result).toBe('http://www.myurl.com/?abc=123&foo=bar');
    });

    it('Should add to the url search', () => {
        const result = url.build('http://www.myurl.com/?bar=baz', {
            search: {abc: 123, foo: 'bar'}
        });
        expect(result).toBe('http://www.myurl.com/?bar=baz&abc=123&foo=bar');
    });

    it('Should replace url search', () => {
        const result = url.build('http://www.myurl.com/?foo=bar', {
            search: {foo: 123}
        });
        expect(result).toBe('http://www.myurl.com/?foo=123');
    });

    it('Should replace and add url search', () => {
        const result = url.build('http://www.myurl.com/?foo=bar', {
            search: {abc: 123, foo: 'baz'}
        });
        expect(result).toBe('http://www.myurl.com/?foo=baz&abc=123');
    });
});
