'use strict';

const qs = require('qs');

function getRedirectionUrl(type, questionnaireId, queryParameters = {}) {
    const inProgresstatus = questionnaireId ? 'started' : 'notstarted';

    const queryString = qs.stringify(queryParameters, {
        encode: false,
        addQueryPrefix: true
    });

    const urls = {
        notstarted: {
            start: `/apply/start${queryString}`,
            // `/account/sign-in` will redirect to `/account/dashboard` if
            // there is no questionnaire ID in the session.
            resume: '/account/sign-in'
        },
        started: {
            start: `/apply/start${queryString}`,
            resume: `/apply/resume/${questionnaireId}`
        }
    };

    const redirectionUrl = urls[inProgresstatus][type];
    return redirectionUrl;
}

module.exports = getRedirectionUrl;
