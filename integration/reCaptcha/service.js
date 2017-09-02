"use strict";

const Promise = require('promise'),
    request = require('request'),
    url = require('./config.json'),
    Config = instanceOf('config');

module.exports = class {
    static verify(userResponse) {
        return new Promise((resolve, reject) => {
            
            //TODO this is disabled teporamry
            if(true){
                resolve();// Fake Dev Response
            } else {
                request(
                    url.format(Config.reCaptcha.key.secret, userResponse),
                    (err, response, body) => {
                        if (err)
                            return reject(err);

                        let reCaptchaServerResponse = JSON.parse(body);

                        if(reCaptchaServerResponse.success !== true)
                            return reject();

                        resolve();
                    });
            }
        });
    }
};
