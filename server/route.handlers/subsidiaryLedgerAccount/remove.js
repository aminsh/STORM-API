var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.subsidiaryLedgerAccount');

function remove(req, res) {
    // check has journalLine data

    await(repository.remove(req.params.id));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);
