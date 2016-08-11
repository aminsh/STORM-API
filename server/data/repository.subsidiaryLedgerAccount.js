var db = require('../models');

var subsidiaryLedgerAccountRepository = {
    findById: function (id) {
        return db.subsidiaryLedgerAccount.findOne({
            where: {
                id: id
            },
            include: [{
                model: models.subsidiaryLedgerAccountDimensionAssignmentStatus,
                include: {model: models.dimensionCategory}
            }]
        });
    }
};

module.exports = subsidiaryLedgerAccountRepository;

