'use strict';

// const passport = require('passport');
// const {Issuer, Strategy} = require('openid-client');

module.exports = (req, res, next) => {
    console.log(Math.random());
    // const {app} = req;
    // console.log(app);
    // app.use(passport.initialize());
    // app.use(passport.session());

    // // // passport.use(
    // // //     'oidc',
    // // //     new Strategy({Issuer}, (tokenSet, userinfo, done) => {
    // // //         return done(null, tokenSet.claims());
    // // //     })
    // // // );

    // // passport.serializeUser((user, done) => {
    // //     done(null, user);
    // // });
    // // passport.deserializeUser((user, done) => {
    // //     done(null, user);
    // // });
    next();
};
