var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.bank');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The title is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = {
        title: cmd.title
    };

    var entity = await(repository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

function update(req, res) {
    var errors = [];
    var cmd = req.body;

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The title is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = await(repository.findById(req.params.id));

    entity.title = cmd.title;

    await(repository.update(entity));

    res.json({
        isValid: true
    });
}

function remove(req, res) {
    var errors = [];

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(repository.remove(req.params.id));

    res.json({
        isValid: true
    });
}

module.exports.create = async(create);
module.exports.update = async(update);
module.exports.remove = async(remove);