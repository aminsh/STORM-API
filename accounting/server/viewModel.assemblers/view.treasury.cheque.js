var enums = instanceOf('Enums');

function treasuryChequeAssembler(entity) {
    var viewModel = {
        id: entity.id,
        transferDate: entity.transferDate,
        documentType: entity.documentType,
        payerId: entity.sourceDetailAccountId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.destinationDetailAccountId,
        receiverTitle: entity.destinationTitle,
        description: entity.description,
        imageUrl: entity.imageUrl,
        amount: entity.amount,
        journals: entity.journals,
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
        payTo: documentDetail.payTo,
        chequeAccountNumber: documentDetail.chequeAccountNumber,
        canTransferToAnother: documentDetail.canTransferToAnother,
        status: documentDetail.status,
        chequeStatusHistory: documentDetail.chequeStatusHistory,
        statusDisplay: enums.ReceiveChequeStatus().getDisplay(documentDetail.status),
        chequeCategoryId: documentDetail.chequeCategoryId
    }
}

module.exports = treasuryChequeAssembler;
