(function () {
    'use strict';

    module.exports = {
        ui: {
            buttons: {
                save: "Save",
                edit: "Edit",
                back: "Back",
                submit: "Submit",
                login: "Log in",
                logout: "Log out",
                profile: "Profile",
                userlist: "User list",
            },
            labels: {
                login: "login",
                password: "password",
                role: "role",
                connection: "log in",
            },
        },
        titles: {
            main: "Home",
            profileof: "Profile of \"{login}\"",
        },
        messages: {
            error: {
                loginused: "the login \"{login}\"is already taken, please choose another",
            },
            info: {
                profileupdated: {
                    own: "Your profile details have been updated",
                    other: "The profile of \"{login}\" has been updated",
                }
            },
        }
    };
}());
