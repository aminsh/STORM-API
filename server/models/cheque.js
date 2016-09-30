var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var Cheque = sequelize.define('cheque', {
        number: {
            type: DataTypes.INTEGER
        },
        date: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.DOUBLE
        },
        status: {
            type: DataTypes.ENUM,
            values: enums.ChequeStatus().getKeys()
        }
    }, {
        classMethods: {
            associate: function (models) {
                Cheque.belongsTo(models.chequeCategory);
                Cheque.belongsTo(models.journalLine);
            }
        }
    });

    return Cheque;
};