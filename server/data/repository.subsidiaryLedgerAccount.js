var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var subsidiaryLedgerAccountRepository = {
    findById: function (id, generalLedgerAccountId) {
        return db.subsidiaryLedgerAccount.findOne({
            where: {
                id: id
            },
            include: [{
                model: models.subsidiaryLedgerAccountDimensionAssignmentStatus,
                include: {model: models.dimensionCategory}
            }, {
                model: models.generalLedgerAccount,
                where: {id: generalLedgerAccountId}
            }]
        });
    },
    findByCode: function (code, notEqualId) {
        var option = {
            where: {
                code: cmd.code
            },
            include: [{
                model: models.generalLedgerAccount,
                where: {id: cmd.generalLedgerAccountId}
            }]
        };

        if (notEqualId)
            option.where.id = {
                $ne: cmd.id
            };

        return models.subsidiaryLedgerAccount.findOne(option)
    },
    create: function (entity) {
        return db.subsidiaryLedgerAccount.create(entity, {
            include: [{
                model: models.subsidiaryLedgerAccountDimensionAssignmentStatus
            }]
        });
    },
    update: function (entity, dimensionStatus) {
        var t = await(models.sequelize.transaction());

        try {

            entity.subsidiaryLedgerAccountDimensionAssignmentStatuses
                .forEach(function (d) {
                    d.destroy({transaction: t});
                });

            dimensionStatus.forEach(function (das) {
                await(models.subsidiaryLedgerAccountDimensionAssignmentStatus
                    .create({
                        subsidiaryLedgerAccountId: sla.id,
                        dimensionCategoryId: das.dimensionCategoryId,
                        assignmentStatus: das.assignmentStatus
                    }, {transaction: t}));

            });

            await(entity.save({transaction: t}));

            t.commit();
        }
        catch (err) {
            t.rollback();
            throw new Error(err);
        }
    },
    remove: async(function (id) {
        var t = await(db.sequelize.transaction());

        try {
            var entity = await(db.subsidiaryLedgerAccount.findOne(
                {
                    where: {id: id},
                    include: [{model: models.subsidiaryLedgerAccountDimensionAssignmentStatus}]
                }
            ));

            entity.subsidiaryLedgerAccountDimensionAssignmentStatuses
                .forEach(function (d) {
                    d.destroy({transaction: t});
                });

            await(entity.destroy({transaction: t}));

            t.commit();
        }
        catch (err) {
            t.rollback();

            throw new Error(err);
        }
    })
};

module.exports = subsidiaryLedgerAccountRepository;

