(function () {
    'use strict';

    module.exports = {
        ui: {
            buttons: {
                save: "Enregistrer",
                edit: "Modifier",
                back: "Retour",
                submit: "Envoyer",
                login: "Se connecter",
                logout: "Se déconnecter",
                profile: "Profil",
                userlist: "Liste des utilisateurs",
            },
            labels: {
                login: "nom d'utilisateur",
                twitterAccount: "compte Twitter",
                password: "mot de passe",
                role: "rôle",
                connection: "connexion",
            },
        },
        titles: {
            main: "Accueil",
            profileof: "Profil de « {login} »",
        },
        messages: {
            error: {
                loginused: "le nom d'utilisateur \"{login}\" est déjà pris, veuillez en choisir un autre",
            },
            info: {
                profileupdated: {
                    own: "Votre profil a bien été mis à jour",
                    other: "Le profil de \"{login}\" a bien été mis à jour",
                }
            },
        }
    };
}());
