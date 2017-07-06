"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Promise = require('promise'),
    CryptoJS = require("crypto-js"),
    jwt = require('jsonwebtoken'),
    superSecret = 'i love nodejs';

module.exports.encrypt = function (data) {
    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), superSecret);
    return encryptedData.toString();
};

module.exports.decrypt = function (token) {
    let bytes = CryptoJS.AES.decrypt(token, superSecret),
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
};

module.exports.sign = data => {
    return jwt.sign(data, superSecret);
};

module.exports.verify = async.result(token => {
    return await(verify(token));
});

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, superSecret, (error, decode) => {
            if (error)
                return reject(error);

            resolve(decode);
        });
    });
}

module.exports.superSecret = superSecret;
