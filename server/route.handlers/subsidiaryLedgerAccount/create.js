var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.subsidiaryLedgerAccount');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The code is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (!string.isNullOrEmpty(cmd.code)) {
        var sla = await(repository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

        if (sla)
            errors.push(translate('The code is duplicated'));
    }

    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    var entity = await(repository.findById(cmd.id));

    entity.code = cmd.code;
    entity.title = cmd.title;
    entity.isBankAccount = cmd.isBankAccount;
    entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
    entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
    entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
    entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

module.exports = async(create);
