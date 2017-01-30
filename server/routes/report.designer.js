var express = require('express');
var router = express.Router();
var translates = require('../config/translate.fa.json');
var fs = require("fs");
var path = require('path');
var persianDateService = require('../services/persianDateService');

var fonts = fs.readdirSync(__dirname + '/../../client/fonts')
    .filter(function (fileName) {
        return path.extname(fileName) == '.ttf';
    }).asEnumerable().select(function (fileName) {
        return {
            fileName: fileName,
            name: path.basename(fileName, '.ttf')
        }
    }).toArray();

router.route('/designer/:name?/:mode').get(function (req, res) {

    res.render('report.designer.ejs', {
        translates: translates,
        today: persianDateService.current(),
        fonts: fonts,
        name: req.params.name,
        mode: req.params.mode
    });
});

router.route('/reports').get(function (req, res) {
    var reports = fs.readdirSync(__dirname + '/../../client/reportFiles')
        .asEnumerable()
        .select(function (fileName) {
            return {fileName: fileName};
        })
        .toArray();

    res.render('reports.ejs', {reports: reports});
});


module.exports = router;

