var async = require('asyncawait/async');
var await = require('asyncawait/await');

function journalLine(dbSource, dbTarget, journalId) {
    console.log('start converting journalLine ...');
    var documents = await(new dbSource.Request()
        .query(`select *,ROW_NUMBER() OVER(ORDER BY radif) as row
                from document where id = ${journalId}`));

    documents.forEach((item)=> {
        var generalLedgerAccountId = await(dbTarget.select()
            .from('generalLedgerAccounts')
            .where('code', item.code1))[0].id;

        var subsidiaryLedgerAccountId = await(dbTarget.select()
            .from('subsidiaryLedgerAccounts')
            .where('code', item.code2)
            .andWhere('generalLedgerAccountId', generalLedgerAccountId))[0].id;

        var dimensionCategoryIds = await(dbTarget.select('id').from('dimensionCategories'));

        await(dbTarget('journalLines').insert({
            id: item.NC,
            journalId: journalId,
            row: item.row,
            debtor: item.Bed,
            creditor: item.Bes,
            article: item.Article,
            generalLedgerAccountId: generalLedgerAccountId,
            subsidiaryLedgerAccountId: subsidiaryLedgerAccountId,
            detailAccountId: item.code3
                ? await(dbTarget.select()
                .from('detailAccounts')
                .where('code', item.code3))[0].id
                : null,

            dimension1Id: await(getDimensionId(dbTarget, dimensionCategoryIds[0].id, item.code4)),

            dimension2Id: await(getDimensionId(dbTarget, dimensionCategoryIds[1].id, item.code5)),

            dimension3Id: await(getDimensionId(dbTarget, dimensionCategoryIds[2].id, item.code6)),

            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));

        console.log('end converting journalLine ...');
    });
}

var getDimensionId = async(function (db, categoryId, code) {
    if (!code) return null;

    var dimension = await(db.select().from('dimensions')
        .where('dimensionCategoryId', categoryId)
        .andWhere('code', code));

    if (!dimension) return null;
    if (dimension.length == 0) return null;

    return dimension[0].id;
});

module.exports = async(journalLine);