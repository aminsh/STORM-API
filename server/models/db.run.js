require('../utilities/string.prototypes.js');
require('../utilities/array.prototypes.js');

var db = require('./');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../services/knexService');

db.sequelize.sync({force: true}).then(function () {
    console.log('sequelize sync ...');

    async(run)();
});

function run() {
    var exp = knexService.select(
        'journals.id',
        'journals.temporaryNumber',
        'journals.temporaryDate',
        'journals.number',
        'journals.date',
        'journals.description',
        'journals.periodId',
        'journals.journalStatus',
        'journals.journalType',
        'jl.generalLedgerAccountId',
        'jl.subsidiaryLedgerAccountId',
        'jl.detailAccountId',
        'jl.dimension1Id',
        'jl.dimension2Id',
        'jl.dimension3Id',
        'jl.article',
        'jl.debtor',
        'jl.creditor'
    ).from('journals')
        .leftJoin(function () {
            this.select().from('journalLines').on('journals.id', '=', 'jl.journalsId').as('jl');
        })
        .toSQL();
    debugger;
}





