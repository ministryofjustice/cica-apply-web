'use strict';

const getTokenHeader = require('.');

const jwt =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0aGlzaXNhdGVzdGNsaWVudGlkIiwiaXNzIjoiaHR0cDovL3d3dy5pc3MuY29tIiwic3ViIjoiaHR0cDovL3d3dy5zdWIuY29tIiwiZXhwIjoxNjY5MTIzOTkyLCJqdGkiOiJ1dWlkIiwiaWF0IjoxNjY5MTIzNjkyLCJub25jZSI6Ik5PTkNFIn0.gxkOWbaHfM1uzmsAUkNQK-t2a0jfWbWTpTObgufVyg1SGC00O0Mo5dPhISxOwq4BDgJ6UY_1LAlFnztz0APbGRfJsMen7XcCdb_kmUvX1DRytwPxAX9tSAHd2wdLCm3qeRlp9pUZ2Bse-HKDRvNryA6u4G_o1FsT43UqcuWtFo1NfLThQco3Sp8k3ZVsFsDsNt100ZMcuwHA-0KlsElePlp_BSkip8B-irGXEjYoVGTCcb5_UL3wQ5WsafaSb8BrGIL1vQfZffYDiB2Mhi6bhBUrQGx5cqUFQihGuSsFKz83nmESysTMJLM6xOp-Er0crBruZZk6Fcrd8qP3v4G8OA';

describe('getTokenHeader', () => {
    it('Should return a decoded JWT header', () => {
        const header = getTokenHeader(jwt);
        expect(header).toEqual({
            alg: 'RS256',
            typ: 'JWT'
        });
    });
});
