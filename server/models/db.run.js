require('../utilities/string.prototypes.js');
require('../utilities/array.prototypes.js');

var db = require('./');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../services/knexService');

db.sequelize.sync().then(function () {
    console.log('sequelize sync ...');

    async(run)();
});

function run() {
    var journal = await(db.journal.findOne({
        where: {
            id: 3
        },
        include: [
            {model: db.journalLine}
        ]
    }));

    debugger;
}





