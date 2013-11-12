(function () {
    'use strict';

    module.exports = UserProvider;

    require('../lib/proto-enhancements');
    var Provider = require('./provider'),
        User = require('../models/user'),
        ObjectID = require('mongodb').ObjectID;

    var COLLECTION_NAME = 'users';

    function UserProvider(db) {
        UserProvider.super_.call(this, COLLECTION_NAME);
        this.db = db;
        this.getCollection(function (error, collection) {
            if (error) {
                throw error;
            }
            collection.ensureIndex({ login: 1 }, { unique: true }, function (error) {
                if (error) {
                    throw error;
                }
            });
        });
    }
    UserProvider.inheritFrom(Provider);

    UserProvider.prototype.list = function listUsers(callback) {
        this.getCollection(function (error, collection) {
            if (error) {
                callback(error);
                return;
            }
            collection.find().toArray(callback);
        });
    };

    UserProvider.prototype.add = function addUser(user, callback) {
        this.getCollection(function (error, collection) {
            if (error) {
                callback(error);
                return;
            }
            collection.insert(user, callback);
        });
    };

    UserProvider.prototype.update = function updateUser(user, callback) {
        this.getCollection(function (error, collection) {
            if (error) {
                callback(error);
                return;
            }
            collection.update({ _id: user._id }, user, { safe: true }, callback);
        });
    };

    UserProvider.prototype.findByLogin = function findUserByLogin(userLogin, callback) {
        this.getCollection(function (error, collection) {
            if (error) {
                callback(error);
                return;
            }
            collection.findOne({ login: userLogin }, function (error, userData) {
                if (error) {
                    callback(error);
                } else if (!userData) {
                    callback(null, null);
                } else {
                    callback(null, new User(userData));
                }
            });
        });
    };

    UserProvider.prototype.findById = function findUserById(userId, callback) {
        this.getCollection(function (error, collection) {
            if (error) {
                callback(error);
                return;
            }
            collection.findOne({ _id: new ObjectID(userId) }, function (error, userData) {
                if (error) {
                    callback(error);
                } else if (!userData) {
                    callback(null, null);
                } else {
                    callback(null, new User(userData));
                }
            });
        });
    };
}());
