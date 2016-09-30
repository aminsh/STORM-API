module.exports = function (sequelize, DataTypes) {
    var DetailAccount = sequelize.define('detailAccount', {
        code: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN
        }

    });

    return DetailAccount;
};
