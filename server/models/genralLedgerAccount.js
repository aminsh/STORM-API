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
            values: ['debit', 'credit']
        },
        postingType: {
            type: DataTypes.ENUM,
            values: ['balanceSheet', 'benefitAndLoss'],
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