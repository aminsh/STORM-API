var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var journalLineRepository = {
    findById: function (id) {
        return db.journalLine.findById(id);
    },
    create: async(function (entity, dimensions) {
        entity = await(db.journalLine.create(entity));
        return entity.setDimensions(dimensions);
    }),
    update: async(function (entity, dimensions) {
        await(entity.save());
        return entity.setDimensions(dimensions);
    }),
    remove: function (entity) {
        return entity.destroy();
    }
};

module.exports = journalLineRepository;
