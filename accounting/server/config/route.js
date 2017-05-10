"use strict";

const app = require('./express');

/* config Routes */

app.use('/api/account-review', require('../routes/api.accountReview'));
app.use('/api/banks', require('../routes/api.bank'));
app.use('/api/cheques', require('../routes/api.cheque'));
app.use('/api/cheque-categories', require('../routes/api.chequeCategory'));
app.use('/api/detail-accounts', require('../routes/api.detailAccount'));
app.use('/api/dimensions', require('../routes/api.dimension'));
app.use('/api/dimension-categories', require('../routes/api.dimensionCategory'));
app.use('/api/fiscal-periods', require('../routes/api.fiscalPeriod'));
app.use('/api/general-ledger-accounts', require('../routes/api.generalLedgerAccount'));
app.use('/api/journals', require('../routes/api.journal'));
app.use('/api/journal-lines', require('../routes/api.journalLine'));
app.use('/api/journal-templates', require('../routes/api.journalTemplate'));
app.use('/api/subsidiary-ledger-accounts', require('../routes/api.subsidiaryLedgerAccount'));
app.use('/api/tags', require('../routes/api.tag'));
app.use('/api/reports', require('../routes/api.report'));
app.use('/api/invoices', require('../routes/api.invoice'));
app.use('/upload', require('../routes/api.upload'));


/* should handled angular routes */
app.get('*', (req, res) => res.render('index.ejs'));








