import createCookiePreference from './index';
import jsCookies from '../../../node_modules/js-cookie/src/js.cookie';

describe('Cookie Preference', () => {
    const cookiePreference = createCookiePreference('testCookie', ['colour', 'drink', 'food']);
    it('should set a preference in a cookie', () => {
        cookiePreference.set('colour', 'green');

        expect(window.document.cookie).toEqual('testCookie={%22colour%22:%22green%22}');
    });

    it('should overwrite a preference in a cookie', () => {
        cookiePreference.set('colour', 'red');
        cookiePreference.set('colour', 'blue');
        cookiePreference.set('colour', 'green');

        expect(window.document.cookie).toEqual('testCookie={%22colour%22:%22green%22}');
    });

    it('should set all allowed preferences at once', () => {
        cookiePreference.acceptAll();
        expect(window.document.cookie).toEqual(
            'testCookie={%22colour%22:%221%22%2C%22drink%22:%221%22%2C%22food%22:%221%22}'
        );
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
        window.document.cookie = 'testCookie={%22drink%22:%22coffee%22}';
        const preference = cookiePreference.get('drink');

        expect(preference).toEqual({
            name: 'drink',
            value: 'coffee'
        });
    });

    it('should get a null value if preference is not defined in the cookie', () => {
        window.document.cookie = 'testCookie={%22drink%22:%22coffee%22%2C%22colour%22:%22green%22}';
        const preference = cookiePreference.get('food');

        expect(preference).toEqual({
            name: 'food',
            value: null
        });
    });

    it('should get an entire cookie', () => {
        window.document.cookie =
            'testCookie={%22colour%22:%221%22%2C%22drink%22:%221%22%2C%22food%22:%221%22}';
        const cookie = cookiePreference.get();
        expect(cookie).toEqual('{"colour":"1","drink":"1","food":"1"}');
    });

    it('should throw with a malformed cookie when getting any specific preference', () => {
        jsCookies.get = jest.fn(() => {
            return 'malformed cookie json 123';
        });
        expect(() => {
            cookiePreference.get('tvshow', 'friends');
        }).toThrow('Unable to get preference "tvshow". cookie value is malformed');
    });
});
