var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.dimension');

function update(req, res) {
    var errors = [];
    var cmd = req.body;

    if (!string.isNullOrEmpty(cmd.code)) {
        var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId, cmd.id));

        if (dimension)
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

    var entity = await(repository.findById(cmd.id));

    entity.title = cmd.title;
    entity.code = cmd.code;
    entity.description = cmd.description;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}
module.exports = async(update);