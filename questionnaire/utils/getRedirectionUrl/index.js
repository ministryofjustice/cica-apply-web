'use strict';

function getRedirectionUrl(type, questionnaireId) {
    const inProgresstatus = questionnaireId ? 'started' : 'notstarted';
    const urls = {
        notstarted: {
            start: '/apply/start',
            resume: '/account/dashboard'
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
