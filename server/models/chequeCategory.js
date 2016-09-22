module.exports = function (sequelize, DataTypes) {
    var ChequeCategory = sequelize.define('chequeCategory', {
        totalPages: {
            type: DataTypes.INTEGER
        },
        firstPageNumber: {
            type: DataTypes.STRING
        },
        lastPageNumber: {
            type: DataTypes.STRING
        },
        isClosed: {
            type: DataTypes.BOOLEAN
        }

    }, {
        classMethods: {
            associate: function (models) {
                ChequeCategory.hasMany(models.cheque);
                ChequeCategory.belongsTo(models.bank);
                ChequeCategory.belongsTo(models.detailAccount);
            }
        }
    });

    return ChequeCategory;
};

