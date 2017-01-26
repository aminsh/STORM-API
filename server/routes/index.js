"use strict";

const config = require('../config'),
    memoryService = require('../services/memoryService'),
    clientTranslation = require('../config/translate.client.fa.json'),
    router = require('express').Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory');

let handler = module.exports.handler = async((req, res) => {
    let dimensionCategoryQuery = new DimensionCategoryQuery(req.cookies['branch-id']),
        dimensionCategories = await(dimensionCategoryQuery.getAll());

    res.render('index.ejs', {
        clientTranslation: clientTranslation,
        currentUser: req.user.name,
        currentBranch: memoryService.get('branches')
            .asEnumerable().single(b => b.id == req.cookies['branch-id']),
        dimensionCategories: dimensionCategories.data,
        version: config.version
    });
});

router.route('/').get(handler);

module.exports.router = router;
