"use strict";

const config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    memoryService = require('../services/memoryService'),
    clientTranslation = require('../config/translate.client.fa.json'),
    router = require('express').Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory'),
    reports = require('../config/reports.json');

let fonts = fs.readdirSync(__dirname + '/../../client/fonts')
    .filter(function (fileName) {
        return path.extname(fileName) == '.ttf';
    }).asEnumerable().select(function (fileName) {
        return {
            fileName: fileName,
            name: path.basename(fileName, '.ttf')
        }
    }).toArray();


let handler = module.exports.handler = async((req, res) => {
    let dimensionCategoryQuery = new DimensionCategoryQuery(req.cookies['branch-id']),
        dimensionCategories = await(dimensionCategoryQuery.getAll());

    res.render('index.ejs', {
        clientTranslation: clientTranslation,
        currentUser: req.user,
        currentBranch: memoryService.get('branches')
            .asEnumerable().single(b => b.id == req.cookies['branch-id']),
        dimensionCategories: dimensionCategories,
        fonts: fonts,
        version: config.version,
        reports: reports
    });
});

router.route('/').get(handler);

module.exports.router = router;
