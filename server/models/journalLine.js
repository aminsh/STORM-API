module.exports = function (sequelize, DataTypes) {
    var JournalLine = sequelize.define('journalLine', {
            row: {
                type: DataTypes.INTEGER
            },
            debtor: {
                type: DataTypes.DOUBLE
            },
            creditor: {
                type: DataTypes.DOUBLE
            },
            article: {
                type: DataTypes.STRING
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    JournalLine.belongsTo(models.journal);
                    JournalLine.belongsTo(models.subsidiaryLedgerAccount);
                    JournalLine.belongsTo(models.detailAccount);
                    JournalLine.hasMany(models.dimension);
                }
            }
        });

    return JournalLine;
};
