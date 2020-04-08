import createCookiePreference from './index';

describe('Cookie Preference', () => {
    const cookiePreference = createCookiePreference('testCookie', ['colour', 'drink', 'food']);
    it('should set a preference in a cookie', () => {
        cookiePreference.set('colour', 'green');

        expect(window.document.cookie).toEqual('testCookie=Y29sb3VyPWdyZWVuLA==');
    });

    it('should overwrite a preference in a cookie', () => {
        cookiePreference.set('colour', 'red');
        cookiePreference.set('colour', 'blue');
        cookiePreference.set('colour', 'green');

        expect(window.document.cookie).toEqual('testCookie=Y29sb3VyPWdyZWVuLA==');
    });

    it('should set all allowed preferences at once', () => {
        cookiePreference.acceptAll();
        expect(window.document.cookie).toEqual('testCookie=Zm9vZD0xLGRyaW5rPTEsY29sb3VyPTEs');
        expect(cookiePreference.get('colour')).toEqual({
            name: 'colour',
            value: '1'
        });
        expect(cookiePreference.get('drink')).toEqual({
            name: 'drink',
            value: '1'
        });
        expect(cookiePreference.get('food')).toEqual({
            name: 'food',
            value: '1'
        });
    });

    it('should not allow an non-whitelist preference to be set', () => {
        expect(() => {
            cookiePreference.set('tvshow', 'friends');
        }).toThrow('Unable to set preference "tvshow" as it is not in the preference whitelist');
    });

    it('should get a preference by name from a cookie', () => {
        window.document.cookie = 'testCookie=ZHJpbms9Y29mZmVlLGNvbG91cj1ncmVlbiw=';
        const preference = cookiePreference.get('drink');

        expect(preference).toEqual({
            name: 'drink',
            value: 'coffee'
        });
    });

    it('should get a null value if preference is not defined in the cookie', () => {
        window.document.cookie = 'testCookie=ZHJpbms9Y29mZmVlLGNvbG91cj1ncmVlbiw=';
        const preference = cookiePreference.get('food');

        expect(preference).toEqual({
            name: 'food',
            value: null
        });
    });

    it('should get an entire cookie', () => {
        window.document.cookie = 'testCookie=Zm9vZD1waXp6YSw=';
        const cookie = cookiePreference.get();
        expect(cookie).toEqual('Zm9vZD1waXp6YSw=');
    });
});
