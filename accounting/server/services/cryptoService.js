"use strict";

const CryptoJS = require("crypto-js"),
    superSecret = 'i love nodejs';

module.exports.encrypt = function (data) {
    "use strict";

    var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), superSecret);
    return encryptedData.toString();
};

module.exports.decrypt = function (token) {
    "use strict";
    var bytes  = CryptoJS.AES.decrypt(token, superSecret);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
};

module.exports.superSecret = superSecret;

