const express = require('express');
const clientSessions = require('client-sessions');

const app = express();

app.use(
    clientSessions({
        cookieName: 'session', // cookie name dictates the key name added to the request object
        secret: 'Ncjcer98ewyFS0HJQdlll89e8gekjJDFS*6rrivo*&R3uyrwkgwejtwzzZzaaPfiriihuuhufsdifsf', // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 10 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    })
);

// app.use((req, res, next) => {
//     if (req.session.seenyou) {
//         res.setHeader('X-Seen-You', 'true');
//     } else {
//         // setting a property will automatically cause a Set-Cookie response
//         // to be sent
//         req.session.seenyou = true;
//         res.setHeader('X-Seen-You', 'false');
//     }
//     console.log(req.session);
//     next();
// });

module.exports = app;
