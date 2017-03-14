var async = require('asyncawait/async');
var await = require('asyncawait/await');

function subsidiaryLedgerAccount(dbSource, dbTarget) {
    console.log('start converting subsidiaryLedgerAccount ...');
    var subLedgers = await(new dbSource.Request().query('select * from SubLedger'));

    console.log('date read from source');

    subLedgers.forEach((item) => {
        await(dbTarget('subsidiaryLedgerAccounts').insert({
            generalLedgerAccountId: await(dbTarget.select().from('generalLedgerAccounts').where('code', item.code1))[0].id,
            code: item.code2,
            title: item.title,
            description: '',
            isBankAccount: item.chq,
            detailAccountAssignmentStatus: item.det ? 'Required' : 'DoesNotHave',
            dimension1AssignmentStatus: item.cen ? 'Required' : 'DoesNotHave',
            dimension2AssignmentStatus: item.code5 ? 'Required' : 'DoesNotHave',
            dimension3AssignmentStatus: item.code6 ? 'Required' : 'DoesNotHave',
            isActive: true,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting subsidiaryLedgerAccount ...');
}


module.exports = async(subsidiaryLedgerAccount);

