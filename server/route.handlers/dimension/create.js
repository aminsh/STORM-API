var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.dimension');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    if (!string.isNullOrEmpty(cmd.code)) {
        var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId));

        if (dimension)
            errors.push(translate('The code is duplicated'));
    }

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The title is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (errors.errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    var entity = await(repository.create({
        code: cmd.code,
        title: cmd.title,
        description: cmd.description,
        isActive: true
    }));

    entity = await(repository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

module.exports = async(create);