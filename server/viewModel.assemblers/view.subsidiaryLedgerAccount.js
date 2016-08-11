var enums = require('../constants/enums');

function subsidiaryLedgerAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        isBankAccount: entity.isBankAccount,
        detailAccountAssignmentStatus: entity.detailAccountAssignmentStatus,
        detailAccountAssignmentStatusDisplay: enums.AssignmentStatus()
            .getDisplay(entity.detailAccountAssignmentStatus),
        description: entity.description,
        isActive: entity.isActive
    };

    viewModel.dimensionAssignmentStatus = entity
        .subsidiaryLedgerAccountDimensionAssignmentStatuses
        .asEnumerable()
        .select(function (das) {
            return {
                id: das.dimensionCategory.id,
                title: das.dimensionCategory.title,
                status: das.assignmentStatus,
                statusDisplay: enums.AssignmentStatus()
                    .getDisplay(das.assignmentStatus)
            };
        })
        .toArray();

    return viewModel;
}

module.exports = subsidiaryLedgerAccountAssembler;
