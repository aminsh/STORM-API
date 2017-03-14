module.exports = function (sequelize, DataTypes) {
    var Branch = sequelize.define('branch', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        }
    },{
        classMethods: {
            associate: function (models) {
                Branch.belongsTo(models.user, {as: 'owner'});
            }
        }
    });

    return Branch;
};