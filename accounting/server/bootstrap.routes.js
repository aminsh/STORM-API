"use strict";

const app = require('./bootstrape');

/* config Routes */

app.use('/api/account-review', require('./routes/api.accountReview'));

app.use('/api/cheques', require('./routes/api.cheque'));
app.use('/api/cheque-categories', require('./routes/api.chequeCategory'));

app.use('/api/detail-accounts', require('./routes/api.detailAccount'));
app.use('/api/detail-account-categories', require('./routes/api.detailAccountCategory'));
app.use('/api/banks', require('./routes/api.bank'));
app.use('/api/people', require('./routes/api.people'));
app.use('/api/funds', require('./routes/api.fund'));

app.use('/api/dimensions', require('./routes/api.dimension'));
app.use('/api/dimension-categories', require('./routes/api.dimensionCategory'));
app.use('/api/fiscal-periods', require('./routes/api.fiscalPeriod'));
app.use('/api/general-ledger-accounts', require('./routes/api.generalLedgerAccount'));
app.use('/api/journals', require('./routes/api.journal'));
app.use('/api/journal-lines', require('./routes/api.journalLine'));
app.use('/api/journal-templates', require('./routes/api.journalTemplate'));
app.use('/api/subsidiary-ledger-accounts', require('./routes/api.subsidiaryLedgerAccount'));
app.use('/api/tags', require('./routes/api.tag'));
app.use('/api/reports', require('./routes/api.report'));
app.use('/api/sales', require('./routes/api.sale'));
app.use('/api/purchases', require('./routes/api.purchase'));
app.use('/api/products', require('./routes/api.product'));
app.use('/api/product-categories', require('./routes/api.productCategory'));
app.use('/api/settings', require('./routes/api.setting'));
app.use('/api/transfer-money', require('./routes/api.moneyTransfer'));
app.use('/api/receive', require('./routes/api.receive'));
app.use('/api/pay', require('./routes/api.pay'));
app.use('/api/bank-and-fund', require('./routes/api.bankAndFund'));
app.use('/api/scales', require('./routes/api.scale'));
app.use('/api/stocks', require('./routes/api.stock'));

app.use('/upload', require('./routes/api.upload'));

/* should handled angular routes */
app.get('*', (req, res) => res.render('index.ejs'));