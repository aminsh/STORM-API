"use strict";

const enums = require('../../../shared/enums');

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
        journal: entity.journal
    };

    return viewModel;
}

module.exports = treasuryAssembler;
