var dbSource = require('mssql');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var dbTarget = require('../server/services/knexService');

var models = [
    'fiscalPeriod',
    'user',
    'generalLedgerAccount',
    'subsidiaryLedgerAccount',
    'detailAccount',
    'dimensionCategory',
    'dimension',
    'tag',
    'journal',
    'bank',
    'chequeCategory'
];

function exec() {
    await(dbSource.connect('mssql://sa:P@ssw0rd@frk-server/mali'));

    models.forEach(model=> {
        await(require(`./${model}`)(dbSource, dbTarget));
    });
}

async(exec)();

