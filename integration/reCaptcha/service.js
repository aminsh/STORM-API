"use strict";

const Promise = require('promise'),
    require = require('request'),
    url = require('./config.json'),
    Config = instanceOf('config');

module.exports = class {
    static verify(userResponse) {
        return new Promise((resolve, reject) => {
            require(
                url.format(Config.reCaptcha.key.secret, userResponse),
                (err, response, body) => {
                    if (err)
                        return reject(err);

                    let reCaptchaServerResponse = JSON.parse(body);

                    if(reCaptchaServerResponse.success !== true)
                        return reject();

                    resolve();
                });
        });
    }
};