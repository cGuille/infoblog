(function () {
    'use strict';

    var strformat = require('strformat');

    var cache = {};

    module.exports = function (config) {
        var supportedLocales = config.supportedLocales,
            defaultLocale = config.defaultLocale || 'en-US';

        return function i18nMiddleware(request, response, next) {
            var lang, locale;

            if (request.session.lang) {
                lang = request.session.lang;
            } else if (request.headers['accept-language']) {
                lang = request.headers['accept-language'];
                lang = lang.substring(0, lang.indexOf(';'));
                lang = lang.split(',').shift();
                request.session.lang = lang;
            }

            if (!lang || supportedLocales.indexOf(lang) === -1) {
                lang = request.session.lang = defaultLocale;
            }
            response.locals.i18n = loadLocale(lang);
            if (!response.locals.i18n) {
                next(new Error('could not find the i18n file for the lang: "' + lang + '"'));
                return;
            }
            next();
        };
    };

    function loadLocale(lang) {
        if (!cache[lang]) {
            cache[lang] = textify(require('../i18n/' + lang));
        }
        return cache[lang];
    }

    function textify(item) {
        var key, value;

        for (key in item) {
            if (item.hasOwnProperty(key)) {
                if (typeof(item[key]) === 'string') {
                    item[key] = new Text(item[key]);
                } else {
                    item[key] = textify(item[key]);
                }
            }
        }
        return item;
    }

    function Text(format) {
        this.string = format;
    }
    Text.prototype.feed = function (data) {
        if (!this.format) {
            this.format = this.string;
        }
        this.string = strformat(this.format, data);
        return this;
    };
    Text.prototype.ucFirst = function () {
        this.string = this.string.charAt(0).toUpperCase() + this.string.substr(1);
        return this;
    };
    Text.prototype.toString = function () {
        return this.string;
    };
}());
