var db = require('../models');

var journalLineRepository = {
    findById: function (id) {
        return db.journalLine.findById(id);
    },
    create: function (entity) {
        return db.journalLine.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: function (entity) {
        return entity.destroy();
    }
}

module.exports = journalLineRepository;
