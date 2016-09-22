module.exports = function (sequelize, DataTypes) {
    var Bank = sequelize.define('bank', {
        title: {
            type: DataTypes.STRING
        }
    });

    return Bank;
}