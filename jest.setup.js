'use strict';

jest.setTimeout(30000);
jest.testEnvironment = 'node';
process.env.CW_DCS_JWT = 'A massive string';
process.env.CW_COOKIE_SECRET = 'Also a huge string';
process.env.CW_DCS_URL = 'http://docker.for.win.localhost:3100';
process.env.CW_LIVECHAT_START_TIME = '10:00:00.000';
process.env.CW_LIVECHAT_END_TIME = '15:00:00.000';
process.env.CW_LIVECHAT_ACTIVE_DAYS = '0,1,2,3,4,5,6';
