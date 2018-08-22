export function view(entity) {

    const enums = this.enums;

    return {
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
        number: entity.number,
        createdAt: entity.createdAt
    };
}

export function cashView(entity) {

    const enums = this.enums;

    return {
        id: entity.id,
        transferDate: entity.transferDate,
        payerId: entity.sourceDetailAccountId,
        payerTitle: entity.sourceTitle,
        receiverId: entity.destinationDetailAccountId,
        receiverTitle: entity.destinationTitle,
        description: entity.description,
        amount: entity.amount,
        documentType: entity.documentType,
        documentTypeDisplay: entity.documentType
            ? enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)
            : '',
        imageUrl: entity.imageUrl,
        journal: entity.journals ? entity.journals[0] : null,
        documentDetailId: entity.documentDetailId || null,
        documentDetail: entity.documentDetailId ? treasuryDocumentDetail(entity.documentDetail) : null
    };

    function treasuryDocumentDetail(documentDetail) {
        return {
            id: documentDetail.id,
            transferTo: documentDetail.transferTo,
            transferFrom: documentDetail.transferFrom
        }
    }
}

export function chequeView(entity) {

    const enums = this.enums;

    return {
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
        journals: entity.journals,
        documentDetailId: entity.documentDetailId,
        documentDetail: treasuryDocumentDetail(entity.documentDetail)
    };

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
            chequeStatusHistory: (documentDetail.chequeStatusHistory || []).asEnumerable()
                .select(chequeStatusHistoryMapper)
                .orderByDescending(item => item.date)
                .toArray(),
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(documentDetail.status),
            chequeCategoryId: documentDetail.chequeCategoryId
        }
    }

    function chequeStatusHistoryMapper(item) {

        if (!item)
            return null;

        return {
            status: item.status,
            createdAt: item.createdAt,
            statusDisplay: item.status ? enums.ReceiveChequeStatus().getDisplay(item.status) : '',
            date: Utility.PersianDate.getDate(item.createdAt),
            journalId: item.journalId,
            order: item.order
        }
    }
}

export function receiptView(entity) {

    const enums = this.enums;

    return {
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
}

export function demandNoteView(entity) {

    return {
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
        journal: entity.journals ? entity.journals[0] : null,
        documentDetailId: entity.documentDetailId,
        documentDetail: treasuryDocumentDetail(entity.documentDetail)
    };

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
}

export function transferView(entity) {

    return {
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
}
