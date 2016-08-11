module.exports = function (sequelize, DataTypes) {
    var FiscalPeriod = sequelize.define('fiscalPeriod', {
        minDate: {
            type: DataTypes.STRING
        },
        maxDate: {
            type: DataTypes.STRING
        },
        isClosed: {
            type: DataTypes.BOOLEAN
        },

    });

    return FiscalPeriod;
};