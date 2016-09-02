var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var SubsidiaryLedgerAccount = sequelize.define('subsidiaryLedgerAccount', {
        code: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        isBankAccount: {
            type: DataTypes.BOOLEAN
        },
        detailAccountAssignmentStatus: {
            type: DataTypes.ENUM,
            values: enums.AssignmentStatus().getKeys(),
        },
        dimension1AssignmentStatus: {
            type: DataTypes.ENUM,
            values: enums.AssignmentStatus().getKeys(),
        },
        dimension2AssignmentStatus: {
            type: DataTypes.ENUM,
            values: enums.AssignmentStatus().getKeys(),
        },
        dimension3AssignmentStatus: {
            type: DataTypes.ENUM,
            values: enums.AssignmentStatus().getKeys(),
        },
        isActive: {
            type: DataTypes.BOOLEAN
        },
    }, {
        classMethods: {
            associate: function (models) {
                SubsidiaryLedgerAccount.belongsTo(models.generalLedgerAccount);
            }
        }
    });

    return SubsidiaryLedgerAccount;
};