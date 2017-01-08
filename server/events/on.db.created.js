var cryptoService = require('../services/cryptoService'),
    memoryService = require('../services/memoryService');

module.exports.name = 'on-db-created';

module.exports.action = (token)=> {
    var config  = cryptoService.decrypt(token),
        dbConfigs = memoryService.get['dbConfigs'];

    dbConfigs.push(config);
};