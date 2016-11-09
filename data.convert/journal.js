var async = require('asyncawait/async');
var await = require('asyncawait/await');
var journalLine = require('./journalLine');

function journal(dbSource, dbTarget) {
    console.log('start converting journal ...');
    var topics = await(new dbSource.Request().query('select * from topics'));

    console.log('date read from source');

    topics.forEach((item) => {
        console.log(`start journal id => ${item.ID}`);

        await(dbTarget('journals').insert({
            id: item.ID,
            description: item.description,
            date: getDate(item.doc_date),
            number: item.doc_no,
            temporaryDate: getDate(item.local_date),
            temporaryNumber: item.local_no,
            journalStatus: getStatus(item),
            journalType: getType(item.Currency),
            createdById: await(getUserId(dbTarget, item.LastUser)),
            periodId: await(getPeriodId(dbTarget, item.Year)),
            isInComplete: await(getIsInComplete(dbSource, item.ID)),
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));

        if (item.KindDocumentID && item.KindDocumentID != 0)

            var isTagExits = await(dbTarget.from('tags')
                    .where('id', item.KindDocumentID)
                    .count())[0].count > 0;

        if (isTagExits)
            await(dbTarget('journalTags').insert({
                journalId: item.ID,
                tagId: item.KindDocumentID,
                createdAt: dbTarget.raw('now()'),
                updatedAt: dbTarget.raw('now()')
            }));

        await(journalLine(dbSource, dbTarget, item.ID));

        console.log(`end journal id => ${item.ID}`);
    });

    console.log('end converting journal ...');
}

function getDate(value) {
    if (!value) return null;

    var date = value.toString();

    var year = date.substring(0, 2);
    var month = date.substring(2, 4);
    var day = date.substring(4);

    return `13${year}/${month}/${day}`;
}

function getStatus(item) {
    if (item.doc_no && item.Fixed)
        return 'Fixed';

    if (item.doc_no && !item.Fixed)
        return 'BookKeeped';

    return 'Temporary';
}

function getType(value) {
    if (!value) return null;
    if (value == 0) return null;

    var types = {
        1: 'Special',
        2: 'FixedAsset',
        3: 'Payroll',
        4: 'Opening',
        5: 'Closing'
    };

    return types[value];
}

var getUserId = async((db, username)=> {
    if (!username)
        return await(db.select().from('users').where('username', 'Public'))[0].id;

    return await(db.select().from('users').where(db.raw('lower("username")'), username.toLowerCase()))[0].id;
});

var getPeriodId = async((db, year)=> {
    return await(db.select().from('fiscalPeriods').where('minDate', 'LIKE', `13${year}%`))[0].id;
});

var getIsInComplete = async((db, id)=> {
    var count = await(new db.Request()
        .query(`select count(*) as countRows from document where id = ${id}`))[0].countRows;

    if (count == 0) return true;

    var remainder = await(new db.Request()
        .query(`select sum(bed) - sum(bes) as [remainder] from document where id = ${id}`))[0].remainder;

    return remainder != 0;
});


module.exports = async(journal);
