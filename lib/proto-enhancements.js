(function () {
    'use strict';

    if (!Array.prototype.contains) {
        /**
         * Test if the array contains the given searchElement.
         * @param  {array element} searchElement the element to search
         * @return {boolean}
         */
        Array.prototype.contains = function Array_contains(searchElement) {
            return this.indexOf(searchElement) !== -1;
        };
    }

    if (!Function.prototype.inheritFrom) {
        var util = require('util');
        Function.prototype.inheritFrom = function Function_inheritFrom(parentConstructor) {
            util.inherits(this, parentConstructor);
        };
    }
}());
