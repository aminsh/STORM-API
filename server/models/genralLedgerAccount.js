var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var GeneralLedgerAccount = sequelize.define('generalLedgerAccount', {
        code: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        balanceType: {
            type: DataTypes.ENUM,
            values: enums.AccountBalanceType().getKeys()
        },
        postingType: {
            type: DataTypes.ENUM,
            values: enums.AccountPostingType().getKeys()
        },
        isActive: {
            type: DataTypes.BOOLEAN
        },

    }, {
        classMethods: {
            associate: function (models) {
                GeneralLedgerAccount.hasMany(models.subsidiaryLedgerAccount)
            }
        }
    });

    return GeneralLedgerAccount;
};