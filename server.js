#!/usr/bin/env node
(function () {
    'use strict';

    /**
     * Module dependencies
     */
    try {
        var express = require('express'),
            http = require('http'),
            path = require('path'),
            sass = require('node-sass'),
            async = require('async'),
            routes = require('./routes'),
            user = require('./routes/user'),
            config = require('./config'),
            db = require('./lib/db-access');
    } catch (error) {
        var moduleName = error.message.substring(error.message.indexOf("'") + 1, error.message.lastIndexOf("'"));
        console.error(error.message);
        if (moduleName && moduleName[0] !== '.') {
            console.error('Did you run `npm install`?');
        }
        process.exit(1);
    }

    var app = express(),
        ENV_DEV = 'development' === app.get('env');

    console.log('env:', app.get('env'));

    // All environments
    // app.enable('trust proxy'); // Needed? See http://expressjs.com/guide.html#proxies
    app.set('port', process.env.PORT || config.server.defaultPort);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(sass.middleware({
        src: path.join(__dirname),
        dest: path.join(__dirname, 'public'),
        debug: ENV_DEV,
        outputStyle: ENV_DEV ? 'expanded' : 'compressed',
    }));
    app.use(express.favicon());
    ENV_DEV && app.use(express.logger('dev')); // Development only
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.app.cookieSecret));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    ENV_DEV && app.use(express.errorHandler()); // Development only

    // Routes definitions
    app.get('/', routes.index);
    app.get('/users', user.list);

    // Starting server
    async.parallel([
        function initMongo(end) {
            db.init(config.mongodb, function mongoReady(error, db) {
                if (!error) {
                    console.log('mongodb connection opened');
                }
                end(error, db);
            });
        },
        function initHttpServer(end) {
            http.createServer(app).listen(app.get('port'), function serverReady() {
                console.log('http server listening on port ' + this.address().port);
                end(null);
            });
        }
    ], function appReady(error) {
        if (error) {
            throw error;
        }
        console.log('infoblog is ready');
    });
}());
