var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var Journal = sequelize.define('journal', {
            temporaryNumber: {
                type: DataTypes.INTEGER
            },
            temporaryDate: {
                type: DataTypes.STRING
            },
            number: {
                type: DataTypes.INTEGER
            },
            date: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING
            },
            journalStatus: {
                type: DataTypes.ENUM,
                values: enums.JournalStatus().getKeys()
            },
            journalType: {
                type: DataTypes.ENUM,
                values: enums.JournalType().getKeys()
            },
            attachmentFileName: {
                type: DataTypes.STRING
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    Journal.belongsTo(models.user, {as: 'createdBy'});
                    Journal.belongsTo(models.fiscalPeriod, {as: 'period'});
                    Journal.hasMany(models.journalLine, {onDelete: ' CASCADE'});
                }
            },
            instanceMethods: {
                getLineSummary: function (models) {
                    return models.journalLine.find({
                        where: {
                            journalId: this.id
                        },
                        attributes: [
                            [models.sequelize.fn('SUM', models.sequelize.col('debtor')), 'sumDebtor'],
                            [models.sequelize.fn('SUM', models.sequelize.col('creditor')), 'sumCreditor'],
                        ],
                        group: ['journalId'],
                        order: ['journalId']
                    })
                }
            }
        });

    return Journal;
};