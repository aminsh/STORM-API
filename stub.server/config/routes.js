var express = require('express');
var config = require('./config');
var app = require('./express').app;

app.get('/', function (req, res) {
    res.render('./index.ejs', {
        clientUrl: config.clientUrl
    });
});

app.post('/upload', function (req, res) {
    res.send({fileName: req.files.userfile.name});
});

var generalLedgerAccountApi = require('../routes/generalLedgerAccountApi');
var subsidiaryLedgerAccountApi = require('../routes/subsidiaryLedgerAccountApi');
var detailAccountApi = require('../routes/detailAccountApi');
var dimensionCategoryApi = require('../routes/dimensionCategoryApi');
var dimensionApi = require('../routes/dimensionApi');
var journalApi = require('../routes/journalApi');
var journalLineApi = require('../routes/journalLineApi');

app.use('/api', generalLedgerAccountApi);
app.use('/api', subsidiaryLedgerAccountApi);
app.use('/api', detailAccountApi);
app.use('/api', dimensionCategoryApi);
app.use('/api', dimensionApi);
app.use('/api', journalApi);
app.use('/api', journalLineApi);