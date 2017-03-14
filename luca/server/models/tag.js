module.exports = function (sequelize, DataTypes) {
    var Tag = sequelize.define('tag', {
        title: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                Tag.belongsToMany(models.journal, {through: 'journalTags'});
            }
        }
    });

    return Tag;
}