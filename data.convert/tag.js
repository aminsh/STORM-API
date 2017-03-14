var async = require('asyncawait/async');
var await = require('asyncawait/await');

function journalTag(dbSource, dbTarget) {
    console.log('start converting journalTag ...');
    var kindDocuments = await(new dbSource.Request().query('select * from KindDocument'));

    console.log('date read from source');

    kindDocuments.forEach((item) => {
        await(dbTarget('tags').insert({
            id: item.ID,
            title: item.Des,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting journalTag ...');
}

module.exports = async(journalTag);
