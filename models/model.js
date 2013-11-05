(function () {
    'use strict';

    module.exports = Model;

    function Model() {}

    Model.prototype.populate = function populate(data) {
        var property;

        for (property in data) {
            if (data.hasOwnProperty(property)) {
                this[property] = data[property];
            }
        }
    };
}());
