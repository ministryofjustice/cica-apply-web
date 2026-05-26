import parseCookie from './parseCookie';

describe('parseCookie', () => {
    it('should parse a valid JSON cookie string', () => {
        expect(parseCookie('{"analytics":"1"}')).toEqual({analytics: '1'});
    });

    it('should return an empty object when given an empty string', () => {
        expect(parseCookie('')).toEqual({});
    });

    it('should return an empty object when given undefined', () => {
        expect(parseCookie(undefined)).toEqual({});
    });

    it('should return an empty object when given null', () => {
        expect(parseCookie(null)).toEqual({});
    });

    it('should return an empty object when the string is malformed JSON', () => {
        expect(parseCookie('not-valid-json')).toEqual({});
    });

    it('should return an empty object when the string is partially malformed', () => {
        expect(parseCookie('{"analytics":')).toEqual({});
    });

    it('should parse a cookie with multiple properties', () => {
        expect(parseCookie('{"analytics":"1","essential":"1"}')).toEqual({
            analytics: '1',
            essential: '1'
        });
    });
});
