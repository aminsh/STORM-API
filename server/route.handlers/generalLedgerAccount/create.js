var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.generalLedgerAccount');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    if (string.isNullOrEmpty(cmd.code))
        errors.push(translate('The code is required'));
    else {
        var gla = await(repository.findByCode(cmd.code));

        if (gla)
            errors.push(translate('The code is duplicated'));
    }

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The title is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    var entity = {
        code: cmd.code,
        title: cmd.title,
        postingType: cmd.postingType,
        balanceType: cmd.balanceType,
        description: cmd.description,
        isActive: true
    };

    entity = await(repository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

module.exports = async(create);
