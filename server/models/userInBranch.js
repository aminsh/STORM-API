var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var UserInBranch = sequelize.define('userInBranch', {
        app: {
            type: DataTypes.ENUM,
            values: enums.App().getKeys()
        },
        state: {
            type: DataTypes.ENUM,
            values: enums.UserInBranchState().getKeys()
        }
    }, {
        classMethods: {
            associate: function (models) {
                UserInBranch.belongsTo(models.branch);
                UserInBranch.belongsTo(models.user);
            }
        }
    });

    return UserInBranch;
};