var async = require('asyncawait/async');
var await = require('asyncawait/await');
var models = require('../models');

var create = async(function (cmd) {
    var gla = await(models.generalLedgerAccount
        .findById(cmd.generalLedgerAccountId));

    var dimensionStatus = cmd.dimensionAssignmentStatus.asEnumerable()
        .select(function (das) {
            return {
                dimensionCategoryId: das.id,
                assignmentStatus: das.status
            };
        })
        .toArray();

    var createdSla = await(models.subsidiaryLedgerAccount.create({
            code: cmd.code,
            title: cmd.title,
            isBankAccount: cmd.isBankAccount,
            detailAccountAssignmentStatus: cmd.detailAccountAssignmentStatus,
            isActive: true,
            generalLedgerAccountId: gla.id,
            subsidiaryLedgerAccountDimensionAssignmentStatuses: dimensionStatus
        },
        {
            include: [{
                model: models.subsidiaryLedgerAccountDimensionAssignmentStatus,
            }]
        }));

    return {id: createdSla.id};
});

var update = async(function (cmd) {
    var t = await(models.sequelize.transaction());

    try {
        var sla = await(models.subsidiaryLedgerAccount.findOne(
            {
                where: {id: cmd.id},
                include: [{model: models.subsidiaryLedgerAccountDimensionAssignmentStatus}]
            }
        ));

        sla.code = cmd.code;
        sla.title = cmd.title;
        sla.isBankAccount = cmd.isBankAccount;
        sla.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;

        var dimensionStatus = cmd.dimensionAssignmentStatus
            .asEnumerable()
            .select(function (das) {
                return {
                    dimensionCategoryId: das.id,
                    assignmentStatus: das.status
                };
            })
            .toArray();

        sla.subsidiaryLedgerAccountDimensionAssignmentStatuses
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

        await(sla.save({transaction: t}));

        t.commit();
    }
    catch (err) {
        t.rollback();
        throw new Error(err);
    }
});

var remove = async(function (cmd) {
    var t = await(models.sequelize.transaction());

    try {
        var sla = await(models.subsidiaryLedgerAccount.findOne(
            {
                where: {id: cmd.id},
                include: [{model: models.subsidiaryLedgerAccountDimensionAssignmentStatus}]
            }
        ));

        sla.subsidiaryLedgerAccountDimensionAssignmentStatuses
            .forEach(function (d) {
                d.destroy({transaction: t});
            });

        await(sla.destroy({transaction: t}));

        t.commit();
    }
    catch (err) {
        t.rollback();

        throw new Error(err);
    }
});

var activate = async(function (cmd) {
    var sla = await(models.subsidiaryLedgerAccount.findById(cmd.id));
    sla.isActive = true;

    await(sla.save());
});

var deactivate = async(function (cmd) {
    var sla = await(models.subsidiaryLedgerAccount.findById(cmd.id));
    sla.isActive = false;

    await(sla.save());
});

module.exports = {
    create: create,
    update: update,
    remove: remove,
    activate: activate,
    deactivate: deactivate
};