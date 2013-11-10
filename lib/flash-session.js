(function () {
    'use strict';

    module.exports = function flash_session(request, response, next) {
        request.flash = new FlashSession(request.session);
        next();
    };

    function FlashSession(session) {
        this.__session = session;
        if (!session.flash) {
            session.flash = {};
        }

        for (var property in session.flash) {
            if (session.flash.hasOwnProperty(property)) {
                this[property] = session.flash[property];
                delete session.flash[property];
            }
        }
    }

    FlashSession.prototype.set = function flash_session_set(property, value) {
        this.__session.flash[property] = value;
    };
}());
