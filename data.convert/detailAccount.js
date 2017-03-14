var async = require('asyncawait/async');
var await = require('asyncawait/await');

function detailAccount(dbSource, dbTarget) {
    console.log('start converting detailAccount ...');
    var details = await(new dbSource.Request().query('select * from detail'));

    console.log('date read from source');

    details.forEach((item) => {
        await(dbTarget('detailAccounts').insert({
            code: item.code3,
            title: item.title,
            isActive: true,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting detailAccount ...');
}


module.exports = async(detailAccount);

