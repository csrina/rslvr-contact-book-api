'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

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
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal("VM's resolver contact book project api");
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
        expect(res.statusCode).to.equal(200);
        expect(res.result.count).to.be.at.least(0);
        expect(res.result.data).to.be.an.array();
    });
});