module.exports = function (sequelize, DataTypes) {
    var Dimension = sequelize.define('dimension', {
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
        },
    }, {
        classMethods: {
            associate: function (models) {
                Dimension.belongsTo(models.dimensionCategory)
            }
        }
    });

    return Dimension;
};