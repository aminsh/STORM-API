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

    debugger;
}
