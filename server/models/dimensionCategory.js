module.exports = function (sequelize, DataTypes) {
    var DimensionCategory = sequelize.define('dimensionCategory', {
        title: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                DimensionCategory.hasMany(models.dimension)
            }
        }
    });

    return DimensionCategory;
};