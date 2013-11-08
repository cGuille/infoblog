(function () {
    'use strict';

    var exports = module.exports = {};

    var UserProvider = require('../providers/user');

    var userProvider;

    exports.init = function init(db) {
        if (userProvider) {
            console.error('erasing userProvider!');
        }
        userProvider = new UserProvider(db);
    };

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
            next();
        } else {
            callback(null, request.user);
        }

        function callback(error, user) {
            if (error) {
                next(error);
                return;
            }

            if (!user) {
                next(new Error('this user does not exist'));
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
    exports.list = function listUsers(req, res) {
        userProvider.list(function (error, userList) {
            res.send(error || JSON.stringify(userList));
        });
    };

    /*
     * GET user
     */
    exports.details = function findUser(req, res, next) {
        var userLogin = req.query.login,
            userId = req.query.id;

        if (userLogin) {
            userProvider.findByLogin(userLogin, callback);
        } else if (userId) {
            userProvider.findById(userId, callback);
        } else {
            next();
        }

        function callback(error, user) {
            if (error) {
                res.send(JSON.stringify(error));
            } else if (!user) {
                res.send('This user does not exist.');
            } else {
                res.send(JSON.stringify(user));
            }
        }
    };
}());
