require('../utilities/string.prototypes.js');
require('../utilities/array.prototypes.js');

var db = require('./');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../services/knexService');

db.sequelize.sync().then(function () {
    console.log('sequelize sync ...');

    async(run)();
});

function run() {
    var users = await(db.user.findAll());

    var options = {limit: 100};
    options.distinct = true;
    options.include = [
        {
            model: db.journalLine
        },
        {model: db.user, as: 'createdBy'}
    ];

    db.journal.findAndCountAll(options)
        .then(function (result) {
            //debugger;
        });
}

var knexService = require('../services/knexService');

/*knexService.select(knexService.raw('"journalLines".*, "generalLedgerAccounts".title as generalLedgerAccountTitle,"subsidiaryLedgerAccounts".title as subsidiaryLedgerAccountTitle'))
 .from('journalLines')
 .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
 .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
 .limit(100)
 .then(function (result) {
 //debugger;
 })*/

knexService.select().from('journalLines')
    .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
    .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
    .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
    .leftJoin(knexService.raw('"dimensions" as dimensions1'), 'journalLines.dimension1Id', knexService.raw('"dimensions1".id'))
    .leftJoin(knexService.raw('"dimensions" as dimensions2'), 'journalLines.dimension2Id', knexService.raw('"dimensions2".id'))
    .leftJoin(knexService.raw('"dimensions" as dimensions3'), 'journalLines.dimension3Id', knexService.raw('"dimensions3".id'))
    .limit(100)
    .then(function (result) {
        debugger;
    })


