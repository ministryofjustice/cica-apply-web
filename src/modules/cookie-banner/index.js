function createCookieBanner(window, cookiePreference) {
    const cookieBannerElement = window.document.querySelector('#cookie-banner');

    function show() {
        if (!cookiePreference.get()) {
            cookieBannerElement.classList.add('cookie-banner--visible');
        }
    }

    function hide() {
        cookieBannerElement.classList.remove('cookie-banner--visible');
    }

    const buttonAcceptAll = window.document.querySelector('#cookie-banner-accept-all');

    buttonAcceptAll.addEventListener('click', e => {
        cookiePreference.acceptAll();
        hide();
        e.preventDefault();
        return false;
    });

    const formCookiePreference = window.document.querySelector('#cookie-preferences');
    if (formCookiePreference) {
        const preferencesElements = formCookiePreference.querySelectorAll(
            '[data-cookie-preference]'
        );
        // check/select the radio button that corresponds to the current cookie settings.
        preferencesElements.forEach(element => {
            if (
                element.value ===
                cookiePreference.get(element.getAttribute('data-cookie-preference')).value
            ) {
                // eslint-disable-next-line no-param-reassign
                element.checked = true;
            }
        });
        formCookiePreference.addEventListener('submit', e => {
            const preferencesElementsSelected = formCookiePreference.querySelectorAll(
                '[data-cookie-preference]:checked'
            );
            // always needs to be set regardless.
            cookiePreference.set('essential', 1);
            preferencesElementsSelected.forEach(element => {
                cookiePreference.set(element.getAttribute('data-cookie-preference'), element.value);
            });
            hide();
            window.document
                .querySelector('#preferences-set-success')
                .classList.remove('moj-banner--invisible');
            // eslint-disable-next-line no-param-reassign
            window.document.body.scrollTop = 0;
            // eslint-disable-next-line no-param-reassign
            window.document.documentElement.scrollTop = 0;
            e.preventDefault();
            return false;
        });
    }

    return Object.freeze({
        show,
        hide
    });
}

export default createCookieBanner;
