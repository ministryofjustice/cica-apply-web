import createCookiePreference from './index';

describe('Cookie Banner', () => {
    const cookiePreference = createCookiePreference('testCookie', ['colour', 'drink', 'food']);
    it('should set a preference in a cookie', () => {
        cookiePreference.set('colour', 'green');

        expect(window.document.cookie).toEqual('testCookie=Y29sb3VyPWdyZWVuLA==');
    });
});
