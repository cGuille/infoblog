(function () {
    'use strict';

    module.exports = User;

    var crypto = require('crypto'),
        Model = require('./model');

    User.prototype = new Model();

    function User(userData) {
        if (userData) {
            this.populate(userData);
        }

        if (!this.registrationDate) {
            this.registrationDate = new Date();
        }
    }

    User.prototype.update = function(userData) {
        var allowedFields = ['login', 'role'],
            field;

        for (field in userData) {
            if (userData.hasOwnProperty(field)) {
                if (allowedFields.indexOf(field) === -1) {
                    throw new Error('changing the field ' + field + ' is not allowed');
                }
            }
        }

        this.populate(userData);
    };

    User.prototype.setPassword = function (rawPassword) {
        this.hashpass = hashPassword(rawPassword, getSalt.call(this));
    };

    User.prototype.checkPassword = function(password) {
        return this.hashpass === hashPassword(password, getSalt.call(this));
    };

    function getSalt() {
        return (+this.registrationDate).toString();
    }

    function hashPassword(rawPassword, salt) {
        var hash = crypto.createHash('sha256');
        hash.update(salt);
        hash.update(rawPassword);
        return hash.digest('hex');
    }
}());
