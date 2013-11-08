(function () {
    'use strict';

    var exports = module.exports = {};

    var querystring = require('querystring'),
        HttpError = require('../lib/http-error'),
        UserProvider = require('../providers/user');

    var userProvider;

    exports.init = function init(db) {
        if (userProvider) {
            console.error('erasing userProvider!');
        }
        userProvider = new UserProvider(db);
    };

    /*

    /*
     * GET user profile
     */
    exports.profile = function userProfile(request, response, next) {
        var userLogin = request.query.login,
            userId = request.query.id,
            isOwner = request.user && request.user.role === 'owner',
            editionMode = request.query.mode === 'edition' && (!userLogin && !userId || isOwner);

        if (userLogin) {
            userProvider.findByLogin(userLogin, callback);
        } else if (userId) {
            userProvider.findById(userId, callback);
        } else if(!request.user) {
            response.redirect('/login?' + querystring.stringify({ from: '/user/profile' }));
        } else {
            callback(null, request.user);
        }

        function callback(error, user) {
            if (error) {
                next(error);
                return;
            }

            if (!user) {
                next(new HttpError(404, 'this user does not exist'));
            } else {
                response.render('user/profile', {
                    userProfile: user,
                    mode: editionMode ? 'edition' : 'reading'
                });
            }
        }
    };

    /*
     * GET users listing.
     */
    exports.list = function listUsers(request, response) {
        userProvider.list(function (error, userList) {
            if (error) {
                next(error);
            } else {
                response.json(userList);
            }
        });
    };

    /*
     * GET user
     */
    exports.details = function findUser(request, response, next) {
        var userLogin = request.query.login,
            userId = request.query.id;

        if (userLogin) {
            userProvider.findByLogin(userLogin, callback);
        } else if (userId) {
            userProvider.findById(userId, callback);
        } else {
            next(new HttpError(400, 'no user specified'));
        }

        function callback(error, user) {
            if (error) {
                next(error);
            } else if (!user) {
                next(new HttpError(404, 'this user does not exist'));
            } else {
                response.json(user);
            }
        }
    };
}());
