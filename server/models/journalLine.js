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
                    JournalLine.belongsTo(models.generalLedgerAccount);
                    JournalLine.belongsTo(models.subsidiaryLedgerAccount);
                    JournalLine.belongsTo(models.detailAccount);
                    JournalLine.belongsTo(models.dimension, {as: 'dimensions1'});
                    JournalLine.belongsTo(models.dimension, {as: 'dimensions2'});
                    JournalLine.belongsTo(models.dimension, {as: 'dimensions3'});
                }
            }
        });

    return JournalLine;
};
