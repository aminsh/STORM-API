var cryptoService = require('../services/cryptoService');

module.exports.authToken = function (userId, branchId) {
    "use strict";
    var data = {
        userId: userId,
        branchId: branchId
    };

    return cryptoService.encrypt(data);
};