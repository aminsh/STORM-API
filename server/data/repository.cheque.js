var db = require('../models');

var Repository = {
    findById: function (id) {
        return db.cheque.findById(id);
    },
    update: function (entity) {
        return entity.save();
    }
};

module.exports = Repository;


