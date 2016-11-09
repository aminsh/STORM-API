var async = require('asyncawait/async');
var await = require('asyncawait/await');

function generalLedgerAccount(dbSource, dbTarget) {
    console.log('start converting generalLedgerAccounts ...');
    var ledgers = await(new dbSource.Request().query('select * from ledger'));

    console.log('date read from source');

    ledgers.forEach((item) => {
        await(dbTarget('generalLedgerAccounts').insert({
            code: item.code1,
            title: item.title,
            description: '',
            balanceType: getBalanceType(item.LedgerSign),
            postingType: getPostingType(item.Grp1),
            isActive: true,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting generalLedgerAccounts ...');
}

function getBalanceType(value) {
    if (value == null || value == 0)
        return null;
    if (value == 1)
        return 'debit';
    if (value == -1)
        return 'credit'
}

function getPostingType(value) {
    var types = {
        1: 'balanceSheet',
        2: 'benefitAndLoss',
        3: 'entezami'
    };

    return types[value];
}
module.exports = async(generalLedgerAccount);

