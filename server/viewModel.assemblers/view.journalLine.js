function journalLineView(entity) {

    var viewModel = {
        id: entity.id,
        row: entity.row,
        generalLedgerAccountId: entity.generalLedgerAccountId,
        generalLedgerAccountCode: entity.generalLedgerAccountCode,
        subsidiaryLedgerAccountId: entity.subsidiaryLedgerAccountId,
        subsidiaryLedgerAccountCode: entity.subsidiaryLedgerAccountCode,
        detailAccountId: entity.detailAccountId,
        detailAccountCode: entity.detailAccountCode,
        dimension1Id: entity.dimension1Id,
        dimension2Id: entity.dimension2Id,
        dimension3Id: entity.dimension3Id,
        creditor: entity.creditor,
        debtor: entity.debtor,
        article: entity.article
    };

    return viewModel;
}

module.exports = journalLineView;
