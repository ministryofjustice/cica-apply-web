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
    const buttonSetPreferences = window.document.querySelector('#cookie-banner-set-preferences');

    buttonAcceptAll.addEventListener('click', e => {
        cookiePreference.acceptAll();
        hide();
        e.preventDefault();
        return false;
    });

    buttonSetPreferences.addEventListener('click', e => {
        console.log(cookiePreference.get('nothing'));
        console.log(cookiePreference.get('essential'));
        console.log(cookiePreference.get('analytics'));
        console.log(cookiePreference.get('123NO'));
        e.preventDefault();
        return false;
    });

    return Object.freeze({
        show,
        hide
    });
}

export default createCookieBanner;
