'use strict';

function getRedirectionUrl(type, questionnaireId, isAuthenticated) {
    // A questionnaireId can exist in session for an anonymous, unauthenticated
    // in-progress application. That alone must not be treated as "there is a
    // saved application to continue" - only an authenticated session may skip
    // the One Login sign-in redirect when user selects Continue a saved application.
    const inProgressStatus = isAuthenticated && questionnaireId ? 'started' : 'notstarted';
    const urls = {
        notstarted: {
            start: '/apply/start',
            // `/account/sign-in` will redirect to `/account/dashboard` if
            // there is no questionnaire ID in the session.
            resume: '/account/sign-in'
        },
        started: {
            start: '/apply/start',
            resume: `/apply/resume/${questionnaireId}`
        }
    };

    const redirectionUrl = urls[inProgressStatus][type];
    return redirectionUrl;
}

module.exports = getRedirectionUrl;
