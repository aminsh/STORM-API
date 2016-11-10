function journalLineView(entity) {

    var viewModel = {
        id: entity.id,
        row: entity.row,
        creditor: entity.creditor,
        debtor: entity.debtor,
        article: entity.article,
        generalLedgerAccountId: entity.generalLedgerAccountId,
        generalLedgerAccountCode: entity.generalLedgerAccountCode,
        generalLedgerAccountDisplay: entity.generalLedgerAccountDisplay,
        subsidiaryLedgerAccountId: entity.subsidiaryLedgerAccountId,
        subsidiaryLedgerAccountCode: entity.subsidiaryLedgerAccountCode,
        subsidiaryLedgerAccountDisplay: entity.subsidiaryLedgerAccountDisplay,
        detailAccountId: entity.detailAccountId,
        detailAccountCode: entity.detailAccountCode,
        detailAccountDisplay: entity.detailAccountDisplay,
        dimension1Id: entity.dimension1Id,
        dimension1Display: entity.dimension1Display,
        dimension2Id: entity.dimension2Id,
        dimension2Display: entity.dimension2Display,
        dimension3Id: entity.dimension3Id,
        dimension3Display: entity.dimension3Display,
        chequeId: entity.chequeId,
        chequeNumber: entity.chequeNumber,
        chequeDate: entity.chequeDate,
        chequeDescription: entity.chequeDescription
    };

    return viewModel;
}

module.exports = journalLineView;
