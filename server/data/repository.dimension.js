var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return models.dimension.findById(id);
    },
    findByCode: function (code, dimensionCategoryId, notEqualId) {
        var option = {
            where: {
                code: code
            },
            include: [{
                model: db.dimensionCategory, where: {id: dimensionCategoryId}
            }]
        };

        if (notEqualId)
            option.where.id = {$ne: notEqualId}

        return db.dimension.findOne(option);
    },
    create: function (entity) {
        return db.dimension.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.dimension.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;

