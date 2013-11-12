(function () {
    'use strict';

    require('../lib/proto-enhancements');
    var strformat = require('strformat');

    var cache = {};

    module.exports = function (config) {
        var chooseLanguage = getBestLanguage.bind(
                null,
                config.supportedLanguages || [],
                config.defaultLanguage || 'en'
            );

        return function i18nMiddleware(request, response, next) {
            var lang = chooseLanguage(request.acceptedLanguages);
            try {
                response.locals.i18n = loadLanguage(lang);
            } catch (error) {
                next(error);
                return;
            }
            next();
        };
    };

    function loadLanguage(lang) {
        if (!cache[lang]) {
            try {
                cache[lang] = textify(require('../i18n/' + lang));
            } catch (error) {
                throw new Error('could not load the i18n file for the lang: "' + lang + '"');
            }
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

    function getBestLanguage(supportedLanguages, defaultLanguage, acceptedLanguages) {
        var i;

        for (i = 0; i < acceptedLanguages.length; ++i) {
            if (supportedLanguages.contains(acceptedLanguages[i])) {
                return acceptedLanguages[i];
            }
        }

        var simpleAcceptedLanguages = acceptedLanguages.map(function (lang) {
            return lang.substr(0, 2);
        });

        for (i = 0; i < simpleAcceptedLanguages.length; ++i) {
            if (supportedLanguages.contains(simpleAcceptedLanguages[i])) {
                return simpleAcceptedLanguages[i];
            }
        }

        return defaultLanguage;
    }
}());
