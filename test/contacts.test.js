'use strict';

const Lab = require('@hapi/lab');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

const assert = require('chai').assert;

describe('GET /', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        assert.equal(res.statusCode, 200, 'status code should be 200');
        assert.equal(res.result, "VM's resolver contact book project api", 'body is correct');
    });
});

describe('GET /_api/v1.0/contacts should return 200, a count of at least 0, and data array', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/_api/v1.0/contacts'
        });
        assert.equal(res.statusCode, 200, 'status code should be 200');
        assert.isAtLeast(res.result.count, 0, 'count should at least be 0');
        assert.typeOf(res.result.data, 'array', 'data is an array');
    });
});