'use strict';

jest.setTimeout(30000);
jest.testEnvironment = 'node';
process.env.CW_DCS_JWT = 'A massive string';
process.env.CW_COOKIE_SECRET = 'Also a huge string';
process.env.CW_DCS_URL = 'http://docker.for.win.localhost:3100';
process.env.CW_LIVECHAT_START_TIMES =
    'false,08:30:00.000,08:30:00.000,10:00:00.000,08:30:00.000,08:30:00.000,false';
process.env.CW_LIVECHAT_END_TIMES =
    'false,17:00:00.000,17:00:00.000,17:00:00.000,17:00:00.000,17:00:00.000,false';
