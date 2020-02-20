'use strict';
const Path = require('path');
const Hapi = require('@hapi/hapi');
const Hoek = require('@hapi/hoek');

const start = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Authorization'],
                exposedHeaders: ['Accept'],
                additionalExposedHeaders: ['Accept'],
                maxAge: 60,
                credentials: true
            },
            files: {
                relativeTo: Path.join(__dirname, 'assets')
            }
        }
    });

    server.state('data', {
        ttl: null,
        isSecure: true,
        isHttpOnly: true
    });

    await server.register(require('@hapi/vision'));

    server.views({
        engines: {
            html: require('handlesbars')
        },
        relativeTo: __dirname,
        path: 'templates',
        helpersPath: 'helpers'
    });


    var io = require("socket.io")(server.listener);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }s
    });

    server.route({
        method: 'GET',
        path: '/user',
        handler: function(request, h) {

            const user = {
                firstName: 'John',
                lastName: 'Doe',
                userName: 'JohnDoe',
                id: 123
            }

            return user;
        }
    });

    server.route({
        method: 'GET',
        path: '/view',
        handler: {
            view: {
                template: 'index',
                context: {
                    title: 'My home page'
                }
            }
        }
    });

    io.on("connection", function(socket) {

        console.log('connected');

        // Do all the socket stuff here.

    });

    await server.start();
}

start();
