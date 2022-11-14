'use strict';

// const createAccountsDAL = require('../dal');
const createCookieService = require('../../cookie/cookie-service');

function createAccountService({req, res}) {
    function signIn(userId, idToken) {
        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        signedInCookie.set({userId, idToken});
    }

    function signOut() {
        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        signedInCookie.set({userId: ''});
    }

    function isSignedIn() {
        // check for cookie and base64decode and see if it matches a certain pattern.
        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        // console.log({isSignedIn: signedInCookie.isSet('userId')});
        return signedInCookie.isSet('userId');
    }

    // const db = createAccountsDAL();
    // function getAuthenticatedUserId() {
    //     return db.get('userid');
    // }

    // function setAuthenticatedUserId(id) {
    //     return db.set('userid', id);
    // }

    // function isAuthenticated() {
    //     return !!getAuthenticatedUserId();
    // }

    // return Object.freeze({
    //     getAuthenticatedUserId,
    //     setAuthenticatedUserId,
    //     isAuthenticated
    // });

    return Object.freeze({
        isSignedIn,
        signIn,
        signOut
    });
}

module.exports = createAccountService;
