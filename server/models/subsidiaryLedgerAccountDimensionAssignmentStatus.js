var enums = require('../constants/enums');

module.exports = function (sequelize, DataTypes) {
    var SubsidiaryLedgerAccountDimensionAssignmentStatus = sequelize.define('subsidiaryLedgerAccountDimensionAssignmentStatus', {
        assignmentStatus: {
            type: DataTypes.ENUM,
            values: enums.AssignmentStatus().getKeys()
        }
    }, {
        classMethods: {
            associate: function (models) {
                SubsidiaryLedgerAccountDimensionAssignmentStatus
                    .belongsTo(models.dimensionCategory)
            }
        }
    });

    return SubsidiaryLedgerAccountDimensionAssignmentStatus;
};