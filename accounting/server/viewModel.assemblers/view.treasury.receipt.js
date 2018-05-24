var enums = instanceOf('Enums');

function treasuryReceiptAssembler(entity) {
    var viewModel = {
        id: entity.id,
        transferDate: entity.transferDate,
        documentType: entity.documentType,
        documentTypeDisplay: entity.documentType
            ? enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)
            : '',
        payerId: entity.sourceDetailAccountId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.destinationDetailAccountId,
        receiverTitle: entity.destinationTitle,
        description: entity.description,
        imageUrl: entity.imageUrl,
        amount: entity.amount,
        journal: entity.journals && Array.isArray(entity.journals) ? entity.journals[0] : null,
        documentDetailId: entity.documentDetailId,
        documentDetail: treasuryDocumentDetail(entity.documentDetail)
    };

    return viewModel;
}

function treasuryDocumentDetail(documentDetail) {
    return {
        id: documentDetail.id,
        transferTo: documentDetail.transferTo,
        transferFrom: documentDetail.transferFrom,
        number: documentDetail.number,
        dueDate: documentDetail.dueDate,
        bank: documentDetail.bank,
        bankBranch: documentDetail.bankBranch,
        identity: documentDetail.identity,
        trackingNumber: documentDetail.trackingNumber,
        date: documentDetail.date
    }
}

module.exports = treasuryReceiptAssembler;
