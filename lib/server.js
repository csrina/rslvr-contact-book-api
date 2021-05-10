'use strict';
require('dotenv').config()
const Hapi = require('@hapi/hapi');
const pg = require("pg");
var client = new pg.Client({
    connectionString : process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}); 
client.connect();


const server = Hapi.server({
    port: process.env.PORT,
    host: '0.0.0.0'
});
async function getContacts(client) {
    try {
        var l = await client.query('select first_name || \' \' || last_name as name, email from contact');
        return {
            count: l.rowCount,
            data: l.rows
        };
    } catch (err) {
        console.log(err)
    }
}


server.route({
    method: 'GET',
    path: '/_api/v1.0/contacts',
    handler: async (request, h) => {return await getContacts(client)}
});
server.route({
    method: 'GET',
    path: '/',
    handler: function () {
        return 'VM\'s resolver contact book project api';
    }
  });
exports.init = async () => {
    await server.initialize();
    return server;
};
exports.start = async () => {
    await server.register({
        plugin: require('hapi-pino'),
        options: {
          prettyPrint: true,
          // Redact Authorization headers, see https://getpino.io/#/docs/redaction
          redact: ['req.headers.authorization']
        }
      })
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

exports.server;

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
