'use strict';

jest.setTimeout(3000);
jest.testEnvironment = 'node';
process.env.CW_URL = 'http://cw.com';
process.env.CW_DCS_JWT = 'A massive string';
process.env.CW_COOKIE_SECRET = 'Also a huge string';
process.env.CW_DCS_URL = 'http://docker.for.win.localhost:3100';
process.env.CW_LIVECHAT_ALIVE = 'true';
process.env.CW_LIVECHAT_DISABLED = 'false';
process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED = 'true';
process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE = 'The live chat service will be unavailable';
process.env.CW_LIVECHAT_START_TIMES =
    '00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000';
process.env.CW_LIVECHAT_END_TIMES =
    '23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000';
process.env.CW_GOVUK_CLIENT_ID = 'thisistheclientid';
process.env.CW_GOVUK_PRIVATE_KEY = 'thisisthegovukprivatekey';
process.env.CW_GOVUK_ISSUER_URL = 'http://www.issuer.com';
process.env.CW_SESSION_DURATION = 600000;
