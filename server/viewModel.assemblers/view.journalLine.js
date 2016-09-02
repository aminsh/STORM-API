function journalLineView(entity) {

    var viewModel = {
        row: entity.row,
        generalLedgerAccountId: entity.generalLedgerAccount.id,
        generalLedgerAccount: '{0} {1}'.format(entity.generalLedgerAccount.code, entity.generalLedgerAccount.title),
        subsidiaryLedgerAccountId: entity.subsidiaryLedgerAccount.id,
        subsidiaryLedgerAccount: '{0} {1}'.format(entity.subsidiaryLedgerAccount.code, entity.subsidiaryLedgerAccount.title),
        detailAccountId: entity.detailAccount.id,
        detailAccount: '{0} {1}'.format(entity.detailAccount.code, entity.detailAccount.title),
        dimension1Id: entity.dimension1Id,
        dimension1: '{0} {1}'.format(entity.dimension1.code, entity.dimension1.title),
        dimension2Id: entity.dimension2Id,
        dimension2: '{0} {1}'.format(entity.dimension2.code, entity.dimension2.title),
        dimension3Id: entity.dimension3Id,
        dimension3: '{0} {1}'.format(entity.dimension3.code, entity.dimension3.title),
        creditor: entity.creditor,
        debtor: entity.debtor,
        article: entity.article
    };

    return viewModel;
}

module.exports = journalLineView;
