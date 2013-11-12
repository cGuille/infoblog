(function () {
    'use strict';

    var exports = module.exports = {};

    var MONGO_DUPLICATED_INDEX_ERROR_CODE = 11001;

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
     * POST change profile
     */
    exports.updateProfile = function updateProfile(request, response, next) {
        var userLogin = request.query.login,
            userId = request.query.id,
            isOwner = request.user && request.user.role === 'owner';

        if ((userLogin || userId) && !isOwner) {
            next(new HttpError(403, 'you are not allowed to change this user\'s profile'));
            return;
        }
        if (!isOwner && request.body.role) {
            next(new HttpError(403, 'you are not allowed to change roles'));
            return;
        }

        if (userLogin) {
            userProvider.findByLogin(userLogin, callback);
        } else if (userId) {
            userProvider.findById(userId, callback);
        } else if(!request.user) {
            response.redirect('/login?' + querystring.stringify({ from: request.url }));
        } else {
            callback(null, request.user);
        }

        function callback(error, user) {
            var userData = {
                    login: request.body.login,
                    twitterAccount: request.body.twitterAccount,
                };

            if (request.body.role) {
                userData.role = request.body.role;
            }

            if (error) {
                next(error);
                return;
            }

            if (!user) {
                next(new HttpError(404, 'this user does not exist'));
            } else {
                user.update(userData);
                userProvider.update(user, function (error, affectedRecordsCount) {
                    if (error) {
                        if (error.code !== MONGO_DUPLICATED_INDEX_ERROR_CODE) {
                            next(error);
                        } else {
                            var userError = new Error(error.err);
                            userError.reason = 'duplicated';
                            if (error.err.indexOf('$login_1') !== -1) {
                                userError.duplicatedField = 'login';
                            }
                            request.flash.set('error', userError);
                            request.flash.set('attempt', request.body);
                            response.redirect(request.url);
                        }
                    } else {
                        request.flash.set('updated', true);
                        var query = request.query;
                        delete query.mode;
                        response.redirect(request.path + '?' + querystring.stringify(query));
                    }
                });
            }
        }
    };

    /*
     * GET user profile
     */
    exports.profile = function userProfile(request, response, next) {
        var userLogin = request.query.login,
            userId = request.query.id,
            isOwner = request.user && request.user.role === 'owner',
            editionMode = request.query.mode === 'edition' && (!userLogin && !userId || isOwner),
            editionUrlQuery = { mode: 'edition' };

        if (userLogin) {
            editionUrlQuery.login = userLogin;
            userProvider.findByLogin(userLogin, callback);
        } else if (userId) {
            editionUrlQuery.id = userId;
            userProvider.findById(userId, callback);
        } else if(!request.user) {
            response.redirect('/login?' + querystring.stringify({ from: request.url }));
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
                    error: request.flash.error || null,
                    attempt: request.flash.attempt || null,
                    updated: !!request.flash.updated,
                    mode: editionMode ? 'edition' : 'reading',
                    editionUrl: '/user/profile?' + querystring.stringify(editionUrlQuery)
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
