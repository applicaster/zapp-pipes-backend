// const zappPipesDevKit = require('@applicaster/zapp-pipes-dev-kit');
// const provider = require('./src');

// const zappPipesServer = zappPipesDevKit.createZappPipesServer({
//   providers: [provider],
//   options: {
//     host: '0.0.0.0'
//   }
// });

// zappPipesServer.route({
//   method: 'GET',
//   path: '/{provider}/types',
//   handler(req, reply) {
//     reply(provider.manifest.handlers);
//   },
// });

// zappPipesServer.startServer();

const Hapi = require('hapi');
const server = new Hapi.Server();
const functions = require('firebase-functions');

server.connection();

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout']
     }
};

server.route({
    method: 'GET',
    path: '/v1',
    handler: function (request, reply) {
        reply({data:'hello world from native hapi 2'});
    }
});
// server.register({
//     register: require('good'),
//     options,
// }, (err) => {

//     if (err) {
//         return console.error(err);
//     }

// });



// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.v1 = functions.https.onRequest((event, resp) => {
    const options = {
        method: event.httpMethod,
        url: event.path,
        payload: event.body,
        headers: event.headers,
        validate: false
    };
    console.log(options);
    server.inject(options, function (res) {
        const response = {
            statusCode: res.statusCode,
            body: res.result
        };
        resp.status(res.statusCode).send(res.result);
    });
    // resp.send("google function Hello world");

});
