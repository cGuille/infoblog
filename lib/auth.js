(function () {
    'use strict';

    var querystring = require('querystring'),
        UserProvider = require('../providers/user');

    module.exports = function (config) {
        var userProvider = new UserProvider(config.db),
            restrictions = config.restrictions || {};

        return function authMiddleware(request, response, next) {
            provideUser(userProvider, request, response, function (error) {
                if (error) {
                    next(error);
                    return;
                }

                var pattern, allowedRoles;

                for (pattern in restrictions) {
                    if (restrictions.hasOwnProperty(pattern)) {
                        if (new RegExp(pattern).test(request.path)) {
                            allowedRoles = restrictions[pattern];
                            break;
                        }
                    }
                }

                if (!allowedRoles) {
                    next();
                } else if (!request.user) {
                    response.redirect('/login?' + querystring.stringify({ from: request.url }));
                } else if (allowedRoles.indexOf(request.user.role) === -1) {
                    response.send(403);
                } else {
                    next();
                }
            });
        };
    };

    function provideUser(userProvider, request, response, callback) {
        if (!request.session.uid) {
            callback(null);
        } else {
            userProvider.findById(request.session.uid, function (error, user) {
                if (error) {
                    callback(error);
                } else {
                    request.user = response.locals.user = user;
                    callback(null);
                }
            });
        }
    }
}());
