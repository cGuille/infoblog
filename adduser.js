#!/usr/bin/env node
(function () {
    'use script';

    var VALID_ROLES = [
            'owner',
            'guest',
            'none'
        ];

    var readline = require('readline'),
        config = require('./config').mongodb,
        async = require('async'),
        UserProvider = require('./providers/user'),
        User = require('./models/user');

    var ui = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        }),
        user = new User(),
        userProvider;

    async.series([
        function (end) {
            // Get access to the DB, create a UserProvider
            require('./lib/db-access').init(config, function (error, db) {
                if (error) {
                    end(error);
                } else {
                    userProvider = new UserProvider(db);
                    end(null);
                }
            });
        },
        function (end) {
            // Ask for a login
            ui.question('login: ', function (login) {
                login = login.trim();
                if (!login) {
                    end(new Error('empty login'));
                } else {
                    user.login = login;
                    end(null);
                }
            });
        },
        function (end) {
            // Ask for a password
            ui.question('password: ', function (password) {
                if (!password) {
                    end(new Error('empty password'));
                } else {
                    user.setPassword(password);
                    end(null);
                }
            });
        },
        function (end) {
            // Ask for an optional role
            ui.question('role: ', function (role) {
                role = role.trim();
                if (role) {
                    if (-1 === VALID_ROLES.indexOf(role)) {
                        end(new Error('invalid role "' + role + '", valid roles are: ' + VALID_ROLES.map(function (r) { return '"' + r + '"'; }).join(', ')));
                    } else {
                        user.role = role;
                        end(null);
                    }
                }
            });
        },
        function (end) {
            // Make the created user persist in Mongo
            userProvider.add(user, function (error, data) {
                if (error) {
                    end(error);
                } else {
                    console.log(user);
                    end(null);
                }
            });
        }],
        function (error) {
            ui.close();
            if (error) {
                console.error(error.message);
                process.exit(1);
            } else {
                process.exit(0);
            }
        }
    );
}());
