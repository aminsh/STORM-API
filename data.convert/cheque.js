var async = require('asyncawait/async');
var await = require('asyncawait/await');

function cheque(dbSource, dbTarget, category) {
    console.log('start converting cheque ...');

    var cheques = [];

    for (var i = category.firstPageNumber; i <= category.lastPageNumber; i++) {
        var document = await(new dbSource.Request()
            .query(`select * from document where Cheque = '${i}'`));

        document = (document && document.length > 0) ? document[0] : null;

        var cheque = {
            chequeCategoryId: category.id,
            number: i,
            status: 'White',
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        };

        if (document) {
            cheque.status = 'Used';
            cheque.description = document.ChequeDesc;
            cheque.amount = document.Bes;
            cheque.journalLineId = document.NC;
        }

        cheques.push(cheque);
    }

    await(dbTarget('cheques').insert(cheques));

    console.log('end converting cheque ...');
}

module.exports = async(cheque);