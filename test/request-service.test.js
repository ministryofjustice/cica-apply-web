// 'use strict';

// jest.resetModules();
// jest.mock('got');
// jest.mock('lodash.merge');
// const got = require('got');
// const merge = require('lodash.merge');
// const requestService = require('../questionnaire/request-service')();

// describe('Request-service functions', () => {
//     describe('Post', () => {
//         it('Should post a request', () => {
//             const gotResponse = {status: 'ok'};
//             const mergeResponse = {
//                 url: 'http://www.google.com/',
//                 method: 'POST',
//                 headers: {
//                     accept: 'application/vnd.api+json',
//                     'Content-Type': 'application/vnd.api+json'
//                 },
//                 json: true,
//                 body: {
//                     body: 'This is a body'
//                 },
//                 throwHttpErrors: false
//             };
//             got.mockImplementation(() => gotResponse);
//             merge.mockImplementation(() => mergeResponse);
//             const options = {
//                 url: 'http://www.google.com/',
//                 body: 'This is a body'
//             };
//             const expected = mergeResponse;
//             requestService.post(options);

//             expect(got).toHaveBeenCalledWith('http://www.google.com/', expected);
//         });
//     });

//     describe('Get', () => {
//         it('Should get a request', () => {
//             const gotResponse = {status: 'ok'};
//             const mergeResponse = {
//                 url: 'http://www.google.com/',
//                 method: 'GET',
//                 headers: {
//                     accept: 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 json: true,
//                 throwHttpErrors: false
//             };
//             got.mockImplementation(() => gotResponse);
//             merge.mockImplementation(() => mergeResponse);
//             const options = {};
//             const expected = mergeResponse;
//             requestService.get(options);

//             expect(got).toHaveBeenCalledWith('http://www.google.com/', expected);
//         });
//     });
// });
