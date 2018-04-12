function treasuryCashAssembler(entity) {
    var viewModel = {
        id: entity.id,
        transferDate: entity.transferDate,
        payerId: entity.sourceDetailAccountId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.destinationDetailAccountId,
        receiverTitle: entity.destinationTitle,
        description: entity.description,
        amount: entity.amount,
        documentType: entity.documentType,
        imageUrl: entity.imageUrl,
        journal:  entity.journals ? entity.journals[0] : null,
        documentDetailId: entity.documentDetailId || null,
        documentDetail: entity.documentDetailId ? treasuryDocumentDetail(entity.documentDetail) : null
    };

    return viewModel;
}

function treasuryDocumentDetail(documentDetail) {
    return {
        id: documentDetail.id,
        transferTo: documentDetail.transferTo,
        transferFrom: documentDetail.transferFrom
    }
}

module.exports = treasuryCashAssembler;
