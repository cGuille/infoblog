(function () {
    'use strict';

    var format = require('util').format,
        mongo = require('mongodb');

    var MongoClient = mongo.MongoClient;

    var db;

    var exports = module.exports = {};
    exports.init = initMongoConnection;
    exports.get = getMongoDatabase;

    function initMongoConnection(config, callback) {
        var connectionString = createConnectionString(config),
            options = {};

        if (config.poolSize) {
            options['poolSize'] = config.poolSize;
        }
        if (config.autoReconnect) {
            options['auto_reconnect'] = config.autoReconnect;
        }

        MongoClient.connect(connectionString, options, function (error, createdDb) {
            if (error) {
                callback(error);
            } else {
                db = createdDb;
                callback(error, db);
            }
        });
    }

    function getMongoDatabase() {
        if (!db) {
            throw new Error('the database has not been initialized');
        }
        return db;
    };

    function createConnectionString(config) {
        var MONGO_CONNECTION_STRING_FORMAT = 'mongodb://%s%s/%s';
        return format(MONGO_CONNECTION_STRING_FORMAT, config.host, config.port ? ':' + config.port : '', config.dbName);
    }
}());
