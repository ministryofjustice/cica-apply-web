'use strict';

function getRedirectionUrl(type, questionnaireId) {
    const inProgresstatus = questionnaireId ? 'started' : 'notstarted';
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

    const redirectionUrl = urls[inProgresstatus][type];
    return redirectionUrl;
}

module.exports = getRedirectionUrl;
