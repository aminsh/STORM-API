var db = require('../models');

var generalLedgerAccountRepository = {
    findById: function (id) {

    },
    findByCode: function (code) {
        return models.generalLedgerAccount
            .findOne({where: {code: cmd.code}})
    },
    create: function (entity) {
        return db.generalLedgerAccount.create(entity);
    }
};

module.exports = generalLedgerAccountRepository;