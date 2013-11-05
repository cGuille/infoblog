(function () {
    'use strict';

    module.exports = Provider;

    function Provider(collectionName) {
        this.collectionName = collectionName;
    }

    Provider.prototype.getCollection = function (callback) {
        this.db.collection(this.collectionName, callback);
    };
}());
