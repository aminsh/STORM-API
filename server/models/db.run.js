require('../utilities/string.prototypes.js');
require('../utilities/array.prototypes.js');

var db = require('./');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../services/knexService');

db.sequelize.sync({force: true}).then(function () {
    console.log('sequelize sync ...');

    async(run)();
});

function run() {
    var exp = knexService.select(['id', 'periodId'])
        .from('journals')
        .groupBy(['id', 'periodId'])
        .orderBy(['id', 'periodId'])
        .toSQL();

    debugger;
}





