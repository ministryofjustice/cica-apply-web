'use strict';

const http = require('http');

const createRequestService = require('./index');

const simpleServer = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/vnd.api+json');

    if (req.method === 'GET') {
        res.end('{"get_test": "success"}');
    }

    if (req.method === 'POST') {
        let reqBody = '';

        req.on('data', chunk => {
            reqBody += chunk;
        });

        req.on('end', () => {
            res.end(`{"post_test": ${reqBody}}`);
        });
    }
});

describe('createRequestService', () => {
    beforeAll(() => {
        simpleServer.listen(8125);
    });

    afterAll(() => {
        simpleServer.close();
    });

    it('should GET JSON', async () => {
        const requestService = createRequestService();
        const requestOptions = {
            url: 'http://127.0.0.1:8125/some-api-with-json-response'
        };
        const response = await requestService.get(requestOptions);

        expect(response.body).toEqual({get_test: 'success'});
    });

    it('should POST JSON', async () => {
        const requestService = createRequestService();
        const requestOptions = {
            url: 'http://127.0.0.1:8125/some-api-with-json-response',
            json: {
                is_a: 'success'
            }
        };
        const response = await requestService.post(requestOptions);

        expect(response.body).toEqual({
            post_test: {
                is_a: 'success'
            }
        });
    });
});
