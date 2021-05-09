'use strict';
require('dotenv').config()
const Hapi = require('@hapi/hapi');
const HapiPostgresConnection = require('hapi-postgres-connection');


const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: '0.0.0.0'
    });

    await server.register({
        plugin: HapiPostgresConnection
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            let select = `SELECT * FROM contact limit 1`;
            try {
                const result = await request.pg.client.query(insertData);
                console.log(result);
                return h.response(result.rows[0]);
              } catch (err) {
                console.log(err);
              }
            // return 'Hello World!';
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();