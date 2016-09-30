var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var journalLineRepository = {
    findById: function (id) {
        return db.journalLine.findById(id);
    },
    create: async(function (entity) {
        return db.journalLine.create(entity);
    }),
    update: async(function (entity) {
        return entity.save();
    }),
    remove: function (entity) {
        return entity.destroy();
    }
};

module.exports = journalLineRepository;
