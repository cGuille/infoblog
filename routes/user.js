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
     * GET users listing.
     */
    exports.list = function listUsers(req, res) {
        userProvider.list(function (error, userList) {
            res.send(error || JSON.stringify(userList));
        });
    };

    /*
     * GET user profile
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
