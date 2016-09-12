require('../utilities/string.prototypes.js');
require('../utilities/array.prototypes.js');

var db = require('./');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

db.sequelize.sync().then(function () {
    console.log('sequelize sync ...');

    async(run)();
});

function run() {
    var users = await(db.user.findAll());

    var options = {limit: 100};
    options.distinct = true;
    options.include = [
        {
            model: db.journalLine
        },
        {model: db.user, as: 'createdBy'}
    ];

    db.journal.findAndCountAll(options)
        .then(function (result) {
            debugger;
        });
    debugger;
}
