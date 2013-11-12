(function () {
    'use strict';

    require('./proto-enhancements');
    var STATUS_CODES = require('http').STATUS_CODES;

    module.exports = HttpError;

    function HttpError(status, message) {
        this.status = status;
        this.message = message || STATUS_CODES[this.status];
        HttpError.super_.call(this, this.message);
        HttpError.super_.captureStackTrace.call(this, this.constructor);
        this.name = this.constructor.name;
    }
    HttpError.inheritFrom(Error);
}());
