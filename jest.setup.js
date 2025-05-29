'use strict';

jest.setTimeout(6000);
jest.testEnvironment = 'node';
process.env.CW_DCS_JWT = 'A massive string';
process.env.CW_COOKIE_SECRET = 'Also a huge string';
process.env.CW_DCS_URL = 'http://docker.for.win.localhost:3100';
process.env.CW_URL = 'http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk';
process.env.CW_DOMAIN = 'www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk';
process.env.CW_GOVUK_CLIENT_ID = 'thisistheclientid';
process.env.CW_GOVUK_PRIVATE_KEY = 'thisisthegovukprivatekey';
process.env.CW_GOVUK_ISSUER_URL = 'http://www.80443328-da85-42de-8a3d-06e1d8f8fcc8.gov.uk';
process.env.CW_SESSION_DURATION = 1800000;
process.env.npm_package_version = '1.2.3';
process.env.CW_BUILDTIME_ID = 'Qnefc5ywgazsrupSws1uk';
