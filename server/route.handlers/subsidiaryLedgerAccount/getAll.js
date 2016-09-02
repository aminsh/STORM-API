var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.subsidiaryLedgerAccount');

function getAll(req, res) {
    var parentId = req.params.parentId;

    var kendoRequest = kendoQueryService.getKendoRequestData(req.query);
    kendoRequest.include = [
        {model: db.generalLedgerAccount, where: {id: parentId}}
    ];

    var subsidiaryLedgerAccounts = await(db.subsidiaryLedgerAccount
        .findAndCountAll(kendoRequest));

    var kendoResult = kendoQueryService.toKendoResultData(subsidiaryLedgerAccounts);

    kendoResult.data = kendoResult.data.asEnumerable()
        .select(view)
        .toArray();

    res.json(kendoResult);
}

module.exports = getAll;