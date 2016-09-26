var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.generalLedgerAccount');

function remove(req, res) {
    var errors = [];
    var cmd = req.body;

    var gla = await(repository.findById(req.params.id));

    if (gla.subsidiaryLedgerAccounts.asEnumerable().any())
        errors
            .push(translate('The Current Account has Subsidiary ledger account'));

    //check for journal line

    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    await(repository.remove(req.params.id));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);
