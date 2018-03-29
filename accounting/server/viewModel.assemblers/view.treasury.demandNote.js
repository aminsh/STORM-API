
function treasuryDemandNoteAssembler(entity) {
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
        journal: entity.journals,
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
        totalTreasuryNumber: documentDetail.totalTreasuryNumber,
        paymentLocation: documentDetail.paymentLocation,
        paymentPlace: documentDetail.paymentPlace,
        dueDate: documentDetail.dueDate,
        issueDate: documentDetail.issueDate,
        demandNoteTo: documentDetail.demandNoteTo,
        nationalCode: documentDetail.nationalCode,
        residence: documentDetail.residence
    }
}

module.exports = treasuryDemandNoteAssembler;
