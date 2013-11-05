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

    User.prototype.setPassword = function (rawPassword) {
        var hash = crypto.createHash('sha256');
        hash.update((+this.registrationDate).toString());
        hash.update(rawPassword);
        this.hashpass = hash.digest('hex');
    };
}());
