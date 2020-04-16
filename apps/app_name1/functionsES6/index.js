"use strict";

require("babel-core/register");
require("babel-polyfill");
var functions = require('firebase-functions');
var provider = require('@applicaster/zapp-pipes-provider-mpx');;
var utils = require("./utils");


console.log("providers", provider);
var providerRoutes = utils.createRouterForProviders([provider]);
console.log("zappPipesDevKit.providerRoutes", providerRoutes);

var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection();
server.route(providerRoutes);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.fetchData = functions.https.onRequest(function (event, resp) {
    var options = {
        method: event.method,
        url: event.path + event._parsedUrl.search,
        payload: event.body,
        headers: event.headers,
        validate: false
    };
    server.inject(options, function (res) {
        resp.set('Cache-Control', 'public, max-age=30, s-maxage=60');
        resp.status(res.statusCode).send(res.result);
    });
    // resp.send("google function Hello world");
});

exports.test = functions.https.onRequest(function (event, resp) {
    resp.send(`test google function ${new Date().toString()}`);
});
