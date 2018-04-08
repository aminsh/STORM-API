"use strict";

const enums = require('../../../shared/enums');

function treasuryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        imageUrl: entity.imageUrl,
        documentType: entity.documentType,
        documentTypeDisplay: entity.documentType
            ? enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)
            : '',
        transferDate: entity.transferDate,
        payerId: entity.payerId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.receiverId,
        receiverTitle: entity.destinationTitle,
        amount: entity.amount,
        chequeStatus: entity.status,
        chequeStatusDisplay: entity.status ? enums.ReceiveChequeStatus().getDisplay(entity.status) : '',
        number: entity.number
    };

    return viewModel;
}

module.exports = treasuryAssembler;
