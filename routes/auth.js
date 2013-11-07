(function () {
    'use strict';

    var exports = module.exports = {};

    var querystring = require('querystring'),
        User = require('../models/user'),
        UserProvider = require('../providers/user');

    var userProvider;

    exports.init = function init(db) {
        if (userProvider) {
            console.error('erasing userProvider!');
        }
        userProvider = new UserProvider(db);
    };

    /*
     * GET login page
     */
    exports.loginForm = function askCredentials(request, response) {
        if (request.user) {
            response.redirect('/');
            return;
        }

        var callbackUrl = request.query.from,
            lastAttempt = request.query.attempt,
            error;

        if (request.query.error) {
            error = new Error(request.query.error);
        }

        response.render('auth/login-form', {
            action: callbackUrl ? '?' + querystring.stringify({ from: callbackUrl }) : '',
            data: { login: lastAttempt || '' },
            error: error
        });
    };

    /*
     * POST login
     */
    exports.login = function login(request, response, next) {
        var callbackUrl = request.query.from,
            login = request.body.login,
            password = request.body.password;

        userProvider.findByLogin(login, function (error, userData) {
            if (error) {
                next(error);
                return;
            }
            var user;

            if (userData) {
                user = new User(userData);
                if (user.checkPassword(password)) {
                    request.session.uid = user['_id'];
                    response.redirect(callbackUrl || '/');
                    return;
                }
            }
            response.redirect('/login?' + querystring.stringify({
                from: callbackUrl,
                attempt: login,
                error: 'invalid credentials'
            }));
        });
    };

    /*
     * GET logout
     */
    exports.logout = function logout(request, response) {
        delete request.session.uid;
        response.redirect('/');
    };

}());
