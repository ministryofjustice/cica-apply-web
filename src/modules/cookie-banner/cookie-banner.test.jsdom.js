import createCookieBanner from './index';
import createCookiePreference from '../cookie-preference';

const bannerHtml = `
<div class="cookie-banner govuk-width-container cookie-banner--visible" id="cookie-banner">
    <div class="govuk-grid-row">
        <div class=" govuk-grid-column-two-thirds">
            <div class="cookie-banner__message">
                <span class="govuk-heading-m">Tell us whether you accept cookies</span>
                <p class="govuk-body">This service uses cookies that are essential for the site to work. We also use non-essential cookies to help us improve your experience.</p>
                <p class="govuk-body">Do you accept these non-essential cookies?</p>
            </div>
            <div class="cookie-banner__buttons">
                <div class="cookie-banner__button cookie-banner__button-accept govuk-grid-column-full govuk-grid-column-one-half-from-desktop govuk-!-padding-left-0">
                    <a href="/cookies" id="cookie-banner-accept-all" class="govuk-button button--inline" role="button">Accept all cookies</a>
                </div>
                <div class="cookie-banner__button govuk-grid-column-full govuk-grid-column-one-half-from-desktop govuk-!-padding-left-0">
                    <a href="/cookies" id="cookie-banner-set-preferences" class="govuk-button govuk-button--secondary button--inline" role="button">Set cookie preferences</a>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="moj-banner moj-banner moj-banner--success moj-banner--invisible" id="preferences-set-success">
  <div class="moj-banner__message">
        <p class="govuk-heading-m">Your cookie settings were saved</p>
        <a class="govuk-button" href="/apply">
            Continue your application
        </a>
    </div>
</div>
<form id="cookie-preferences" method="post">
    <div class="govuk-radios govuk-radios--inline">
        <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="q-cookie-preference-analytics" name="q-cookie-preference-analytics" type="radio" value="1" data-cookie-preference="analytics">
            <label class="govuk-label govuk-radios__label" for="q-cookie-preference-analytics">
                Use cookies that measure my website use
            </label>
        </div>
        <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="q-cookie-preference-analytics-2" name="q-cookie-preference-analytics" type="radio" value="0" checked="" data-cookie-preference="analytics">
            <label class="govuk-label govuk-radios__label" for="q-cookie-preference-analytics-2">
                Do not use cookies that measure my website use
            </label>
        </div>
    </div>
    <input type="submit" class="govuk-button" id="save-preferences" value="Save changes" />
</form>
`;

describe('Cookie Banner', () => {
    window.document.body.innerHTML = bannerHtml;
    it('should make the cookie banner visible', () => {
        const cookiePreference = createCookiePreference('testCookie', ['essential', 'analytics']);
        const cookieBanner = createCookieBanner(window, cookiePreference);
        const cookieBannerElement = window.document.querySelector('#cookie-banner');
        cookieBanner.show();
        expect(cookieBannerElement.classList.contains('cookie-banner--visible')).toEqual(true);
    });

    it('should make the cookie banner invisible', () => {
        const cookiePreference = createCookiePreference('testCookie', ['essential', 'analytics']);
        const cookieBanner = createCookieBanner(window, cookiePreference);
        const cookieBannerElement = window.document.querySelector('#cookie-banner');
        cookieBanner.show();
        cookieBanner.hide();
        expect(cookieBannerElement.classList.contains('cookie-banner--visible')).toEqual(false);
    });

    it('should update the DOM after cookie consent', () => {
        const cookiePreference = createCookiePreference('testCookie', ['essential', 'analytics']);
        const cookieBanner = createCookieBanner(window, cookiePreference);
        const cookieBannerElement = window.document.querySelector('#cookie-banner');
        const formCookiePreference = window.document.querySelector('#cookie-preferences');
        const successBannerElement = window.document.querySelector('#preferences-set-success');
        cookieBanner.show();
        formCookiePreference.querySelector('#save-preferences').click();
        expect(cookieBannerElement.classList.contains('cookie-banner--visible')).toEqual(false);
        expect(successBannerElement.classList.contains('moj-banner--invisible')).toEqual(false);
    });

    it('should hide when all preferences are accepted', () => {
        const cookiePreference = createCookiePreference('testCookie', ['essential', 'analytics']);
        const cookieBanner = createCookieBanner(window, cookiePreference);
        const cookieBannerElement = window.document.querySelector('#cookie-banner');
        cookieBanner.show();
        cookieBannerElement.querySelector('#cookie-banner-accept-all').click();
        expect(cookieBannerElement.classList.contains('cookie-banner--visible')).toEqual(false);
    });
});
