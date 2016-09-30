var db = require('../models');

var fiscalPeriodRepository = {
    findById: function (id) {
        return db.fiscalPeriod.findById(id);
    }
};

module.exports = fiscalPeriodRepository;
