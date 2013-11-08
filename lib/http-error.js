(function () {
    'use strict';

    var STATUS_CODES = require('http').STATUS_CODES;

    module.exports = HttpError;

    function HttpError(status, message) {
        this.constructor.prototype.__proto__ = Error.prototype;
        Error.call(this);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
        this.statusText = STATUS_CODES[this.status];
        this.message = message;
    }
}());
