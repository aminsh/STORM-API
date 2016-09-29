module.exports = function (sequelize, DataTypes) {
    var JournalTemplate = sequelize.define('journalTemplate', {
        title: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.TEXT
        }
    });

    return JournalTemplate;
};