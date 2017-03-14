var CryptoJS = require("crypto-js");

module.exports.encrypt = function (data) {
    "use strict";

    var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'i love nodejs');
    return encryptedData.toString();
};

module.exports.decrypt = function (token) {
    "use strict";
    var bytes  = CryptoJS.AES.decrypt(token, 'i love nodejs');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
};