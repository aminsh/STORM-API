"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    FiscalPeriodQuery = require('../accounting/server/queries/query.fiscalPeriod'),
    superSecret = require('../accounting/server/services/cryptoService').superSecret;


module.exports = app;

app.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'],
        noTokenProvidedMessage = {
            success: false,
            message: 'No token provided.'
        };


    if (!token)
        return res.status(403).send(noTokenProvidedMessage);

    jwt.verify(token, superSecret, async((err, decode) => {
        if(err)
            return res.status(403).send(noTokenProvidedMessage);

        req.branchId = decode.branchId;
        req.user = {id: decode.userId};

        let currentPeriod = req.cookies['current-period'];

        if (currentPeriod == null || currentPeriod == 0 || isNaN(currentPeriod)) {
            let fiscalPeriodQuery = new FiscalPeriodQuery(req.branchId),
                maxId = await(fiscalPeriodQuery.getMaxId());
            maxId = maxId || 0;

            res.cookie('current-period', maxId);
        }

        if (!req.cookies['current-mode'])
            res.cookie('current-mode', 'create');

        next();
    }));
});

app.use('/account-review', require('../accounting/server/routes/api.accountReview'));

app.use('/cheques', require('../accounting/server/routes/api.cheque'));
app.use('/cheque-categories', require('../accounting/server/routes/api.chequeCategory'));

app.use('/detail-accounts', require('../accounting/server/routes/api.detailAccount'));
app.use('/banks', require('../accounting/server/routes/api.bank'));
app.use('/people', require('../accounting/server/routes/api.people'));
app.use('/funds', require('../accounting/server/routes/api.fund'));

app.use('/dimensions', require('../accounting/server/routes/api.dimension'));
app.use('/dimension-categories', require('../accounting/server/routes/api.dimensionCategory'));
app.use('/fiscal-periods', require('../accounting/server/routes/api.fiscalPeriod'));
app.use('/general-ledger-accounts', require('../accounting/server/routes/api.generalLedgerAccount'));
app.use('/journals', require('../accounting/server/routes/api.journal'));
app.use('/journal-lines', require('../accounting/server/routes/api.journalLine'));
app.use('/journal-templates', require('../accounting/server/routes/api.journalTemplate'));
app.use('/subsidiary-ledger-accounts', require('../accounting/server/routes/api.subsidiaryLedgerAccount'));
app.use('/tags', require('../accounting/server/routes/api.tag'));
app.use('/reports', require('../accounting/server/routes/api.report'));
app.use('/sales', require('../accounting/server/routes/api.sale'));
app.use('/purchases', require('../accounting/server/routes/api.purchase'));
app.use('/products', require('../accounting/server/routes/api.product'));
app.use('/product-categories', require('../accounting/server/routes/api.productCategory'));
app.use('/settings', require('../accounting/server/routes/api.setting'));
app.use('/transfer-money', require('../accounting/server/routes/api.moneyTransfer'));
app.use('/api/receive', require('../accounting/server/routes/api.receive'));

