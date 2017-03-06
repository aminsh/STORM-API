var CryptoJS = require("crypto-js");

var data = {id: 1, name: 'amin sheikhi'};

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'i love nodejs');

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'i love nodejs');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData);
