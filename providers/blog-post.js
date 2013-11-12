(function () {
    'use strict';

    module.exports = BlogPostProvider;

    require('../lib/proto-enhancements');
    var Provider = require('./provider');

    var COLLECTION_NAME = 'blogposts';

    function BlogPostProvider(db) {
        this.super_.call(this, COLLECTION_NAME);
        this.db = db;
    }
    BlogPostProvider.inheritFrom(Provider);
}());
