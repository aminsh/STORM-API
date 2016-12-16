var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {isEmail: true}
        },
        password: {
            type: DataTypes.STRING
        },
        state:{
            type: DataTypes.ENUM,
            values: enums.UserState().getKeys()
        },
        token: {
            type: DataTypes.STRING
        }
    });

    return User;
};