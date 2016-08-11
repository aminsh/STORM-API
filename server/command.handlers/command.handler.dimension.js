var async = require('asyncawait/async');
var await = require('asyncawait/await');
var models = require('../models');

var create = async(function (cmd) {
    var entity = await(models.dimension.create({
        code: cmd.code,
        title: cmd.title,
        description: cmd.description,
        isActive: true
    }));

    return {id: entity.id};
});

var update = async(function (cmd) {
    var entity = await(models.dimension.findById(cmd.id));

    entity.title = cmd.title;
    entity.code = cmd.code;
    entity.description = cmd.description;

    await(entity.save());
});

var remove = async(function (cmd) {
    var entity = await(models.dimension.findById(cmd.id));

    await(entity.destroy());
});

var activate = async(function (cmd) {
    var entity = await(models.dimension.findById(cmd.id));

    entity.isActive = true;

    await(entity.save());
});

var deactivate = async(function (cmd) {
    var entity = await(models.dimension.findById(cmd.id));

    entity.isActive = false;

    await(entity.save());
});

module.exports = {
    create: create,
    update: update,
    remote: remove,
    activate: activate,
    deactivate: deactivate
}