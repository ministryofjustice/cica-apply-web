'use strict';

const express = require('express');
const clientSessions = require('client-sessions');

const app = express();

app.use(
    clientSessions({
        cookieName: 'cicaSession', // cookie name dictates the key name added to the request object
        secret: process.env.CW_COOKIE_SECRET, // should be a large unguessable string
        duration: 15 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 15 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            ephemeral: false, // when true, cookie expires when the browser closes
            httpOnly: false, // when true, cookie is not accessible from javascript
            proxySecure: false // when true, cookie will only be sent over SSL. use key 'proxySecure' instead if you handle SSL not in your node process
        }
    })
);

module.exports = app;
