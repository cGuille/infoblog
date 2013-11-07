#!/usr/bin/env node
(function () {
    'use strict';

    /**
     * Module dependencies
     */
    try {
        var express = require('express'),
            MongoStore = require('connect-mongo')(express),
            http = require('http'),
            path = require('path'),
            sass = require('node-sass'),
            async = require('async'),
            routes = require('./routes'),
            authRoutes = require('./routes/auth'),
            userRoutes = require('./routes/user'),
            config = require('./config'),
            dbAccess = require('./lib/db-access'),
            auth = require('./lib/auth');
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

    dbAccess.init(config.mongodb, function mongoReady(error, db) {
        if (error) {
            throw error;
        }
        console.log('mongodb connection opened');

        var sessionStore = new MongoStore({ db: db });

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
        app.use(express.session({ store: sessionStore }));
        app.use(auth({
            db: db,
            restrictions: {
                // RegExp of URL path pattern : list of allowed roles
                '^/user/(list|details)': ['owner'],
            }
        }));
        app.use(express.csrf());
        app.use(function exportCSRFProtection(request, response, next) {
            // just add !{csrf_protection} in a jade template form
            response.locals.csrf_protection = '<input type="hidden" name="_csrf" value="' + request.session._csrf + '" />';
            next(null);
        });
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));

        ENV_DEV && app.use(express.errorHandler()); // Development only

        // Routes definitions
        app.get('/', routes.index);

        authRoutes.init(db);
        app.get('/login', authRoutes.loginForm);
        app.post('/login', authRoutes.login);
        app.get('/logout', authRoutes.logout);

        userRoutes.init(db);
        app.get('/user/list', userRoutes.list);
        app.get('/user/details', userRoutes.details);
        app.get('/user/profile', userRoutes.profile);
        // app.post('/user/profile', userRoutes.changeProfile);

        // Starting server
        http.createServer(app).listen(app.get('port'), function serverReady() {
            console.log('http server listening on port ' + this.address().port);
            console.log('infoblog is ready');
        });
    });
}());
