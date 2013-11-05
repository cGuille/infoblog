(function () {
    'use strict';

    module.exports = UserProvider;

    var Provider = require('./provider'),
        User = require('../models/user'),
        ObjectID = require('mongodb').ObjectID;

    function UserProvider(db) {
        this.db = db;
    }

    UserProvider.prototype = new Provider('users');

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
