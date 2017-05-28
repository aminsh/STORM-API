"use strict";

const CryptoJS = require("crypto-js"),
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

module.exports.superSecret = superSecret;
