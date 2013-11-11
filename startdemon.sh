#!/usr/bin/env sh
nodemon -w routes -w lib -w providers -w models -w node_modules -w i18n -w config.js -w server.js server.js
