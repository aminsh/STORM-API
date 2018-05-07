"use strict";

function treasuryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        imageUrl: entity.imageUrl,
        transferDate: entity.transferDate,
        payerId: entity.sourceDetailAccountId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.destinationDetailAccountId,
        receiverTitle: entity.destinationTitle,
        amount: entity.amount,
        journal: entity.journal,
        description: entity.description,
        createdAt: entity.createdAt
    };

    return viewModel;
}

module.exports = treasuryAssembler;
