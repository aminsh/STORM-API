var async = require('asyncawait/async');
var await = require('asyncawait/await');
var subsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount');

var create = async(function (cmd, current) {
    var subsidiaryLedgerAccount = await(subsidiaryLedgerAccountRepository
        .findById(cmd.subsidiaryLedgerAccountId));

    debugger;


});

var update = async(function (cmd) {


});

var remove = async(function (cmd) {

});


module.exports = {
    create: create,
    update: update,
    remove: remove
}
