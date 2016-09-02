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
        dimension1AssignmentStatus: entity.dimension1AssignmentStatus,
        dimension1AssignmentStatusDisplay: enums.AssignmentStatus()
            .getDisplay(entity.dimension1AssignmentStatus),
        dimension2AssignmentStatus: entity.dimension2AssignmentStatus,
        dimension2AssignmentStatusDisplay: enums.AssignmentStatus()
            .getDisplay(entity.dimension2AssignmentStatus),
        dimension3AssignmentStatus: entity.dimension1AssignmentStatus,
        dimension3AssignmentStatusDisplay: enums.AssignmentStatus()
            .getDisplay(entity.dimension3AssignmentStatus),
        description: entity.description,
        isActive: entity.isActive
    };

    return viewModel;
}

module.exports = subsidiaryLedgerAccountAssembler;
