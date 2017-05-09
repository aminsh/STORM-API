"use strict";

const CryptoJS = require("crypto-js");

module.exports.encrypt = function (data) {
    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'i love nodejs');
    return encryptedData.toString();
};

module.exports.decrypt = function (token) {
    let bytes = CryptoJS.AES.decrypt(token, 'i love nodejs'),
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
};