var cryptoService = require('../services/cryptoService');

module.exports.authToken = function (user, branchId) {
    "use strict";
    var data = {
        user: {
            id: user.id,
            name: user.name
        },
        branchId: branchId
    };

    return cryptoService.encrypt(data);
};