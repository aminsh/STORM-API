function journalLineView(entity) {

    var detailAccountDisplay = entity.detailAccount
        ? '{0} {1}'.format(entity.detailAccount.code, entity.detailAccount.title)
        : null;

    var dimension1Display = entity.dimension1 ?
        '{0} {1}'.format(entity.dimension1.code, entity.dimension1.title)
        : null;

    var dimension2Display = entity.dimension2 ?
        '{0} {1}'.format(entity.dimension2.code, entity.dimension2.title)
        : null;

    var dimension3Display = entity.dimension3 ?
        '{0} {1}'.format(entity.dimension3.code, entity.dimension3.title)
        : null;

    var viewModel = {
        id: entity.id,
        row: entity.row,
        generalLedgerAccountId: entity.generalLedgerAccount.id,
        generalLedgerAccountCode: entity.generalLedgerAccount.code,
        generalLedgerAccount: '{0} {1}'.format(entity.generalLedgerAccount.code, entity.generalLedgerAccount.title),
        subsidiaryLedgerAccountId: entity.subsidiaryLedgerAccount.id,
        subsidiaryLedgerAccountCode: entity.subsidiaryLedgerAccount.code,
        subsidiaryLedgerAccount: '{0} {1}'.format(entity.subsidiaryLedgerAccount.code, entity.subsidiaryLedgerAccount.title),
        detailAccountId: entity.detailAccountId,
        detailAccountCode: entity.detailAccount ? entity.detailAccount.code : '',
        detailAccount: detailAccountDisplay,
        dimension1Id: entity.dimension1Id,
        dimension1: dimension1Display,
        dimension2Id: entity.dimension2Id,
        dimension2: dimension2Display,
        dimension3Id: entity.dimension3Id,
        dimension3: dimension3Display,
        creditor: entity.creditor,
        debtor: entity.debtor,
        article: entity.article
    };

    return viewModel;
}

module.exports = journalLineView;
