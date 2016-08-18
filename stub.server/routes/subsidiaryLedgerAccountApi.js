var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var subsidiaryLedgerAccounts = require('./../data/data').subsidiaryLedgerAccounts;

function subsidiaryLedgerAccountApi(app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/subsidiary-ledger-accounts/:parentId')
        .get(function (req, res) {

            var parentId = req.params.parentId;

            var ssla = Enumerable.from(subsidiaryLedgerAccounts)
                .where(function (item) {
                    return item.generalLedgerAccountId = parentId;
                })
                .toArray();

            res.json({data: ssla});
        })
        .post(function (req, res) {
            var parentId = req.params.parentId;
            var cmd = req.body;

            console.log(cmd);

            cmd.id = guidService.newGuid();
            cmd.generalLedgerAccountId = parentId;

            subsidiaryLedgerAccounts.push(cmd);

            res.json({
                validationResult: {isValid: true},
                returnValue: {id: cmd.id}
            });
        });

    apiRouter.route('/subsidiary-ledger-accounts/:id')
        .get(function (req, res) {
            var id = req.params.id;

            var ssla = Enumerable.from(subsidiaryLedgerAccounts)
                .first(function (item) {
                    return item.id == id;
                });

            res.json(ssla);
        })
        .put(function (req, res) {
            var id = req.params.id;
            var cmd = req.body;

            console.log(cmd);

            var sla = Enumerable.from(subsidiaryLedgerAccounts)
                .first(function (item) {
                    return item.id == id
                });

            sla.code = cmd.code;
            sla.title = cmd.title;
            sla.description = cmd.description;
            sla.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
            sla.isBank = cmd.isBank;
            sla.dimensionAssignmentStatus = cmd.dimensionAssignmentStatus;

            res.json({
                validationResult: {isValid: true}
            });
        });

    apiRouter.route('/subsidiary-ledger-accounts/:id/activate')
        .put(function (req, res) {
            var ssla = Enumerable.from(subsidiaryLedgerAccounts)
                .first(function (item) {
                    return item.id == req.params.id
                });

            ssla.isActive = true;

            res.json({
                validationResult: {isValid: true}
            });
        });

    apiRouter.route('/subsidiary-ledger-accounts/:id/deactivate')
        .put(function (req, res) {
            var ssla = Enumerable.from(subsidiaryLedgerAccounts)
                .first(function (item) {
                    return item.id == req.params.id
                });

            ssla.isActive = false;

            res.json({
                validationResult: {isValid: true}
            });
        });

    return apiRouter;
}

module.exports = subsidiaryLedgerAccountApi;