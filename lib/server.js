'use strict';
require('dotenv').config()
const Hapi = require('@hapi/hapi');
var routes = require('./routes.js');


const server = Hapi.server({
    port: process.env.PORT,
    host: '0.0.0.0'
});


server.route(routes);

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
