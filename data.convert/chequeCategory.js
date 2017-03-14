var async = require('asyncawait/async');
var await = require('asyncawait/await');
var cheque = require('./cheque');

function chequeCategory(dbSource, dbTarget) {
    console.log('start converting chequeCategory ...');

    var cheqeBox = await(new dbSource.Request().query('select * from CheqBox '));
    var bankId = await(dbTarget.select().from('banks').limit(1))[0].id;

    cheqeBox.forEach((item)=> {
        var createdCategory = await(dbTarget('chequeCategories').insert({
            detailAccountId: await(dbTarget.select()
                .from('detailAccounts')
                .where('code', item.CBcode3))[0].id,

            bankId: bankId,
            receivedOn: getDate(item.CBdate),
            firstPageNumber: item.CBfromN,
            lastPageNumber: item.CBfromN + item.CBqty - 1,
            totalPages: item.CBqty,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }).returning(['id', 'firstPageNumber', 'lastPageNumber']))[0];

        await(cheque(dbSource, dbTarget, createdCategory));
    });

    console.log('end converting chequeCategory ...');
}

function getDate(value) {
    var date = value.toString();

    if (!value) return null;

    var year = date.substring(0, 2);
    var month = date.substring(2, 4);
    var day = date.substring(4);

    return `13${year}/${month}/${day}`;
}

module.exports = async(chequeCategory);