var memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    cryptoService = require('../services/cryptoService');

module.exports = ()=> {
    memoryService.set('users', []);

   redisClient.get('accDbConfigs', (err, reply)=> {
       "use strict";
       if(err) return console.log(err);

       let dbConfigs = JSON.parse(reply)
           .asEnumerable()
           .select(e => cryptoService.decrypt(e))
           .toArray();

       memoryService.set('dbConfigs', dbConfigs);
   });
};