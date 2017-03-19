"use strict";

const config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    memoryService = require('../services/memoryService'),
    eventEmitter = require('../services/eventEmitter'),
    clientTranslation = require('../config/translate.client.fa.json'),
    router = require('express').Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory'),
    reports = require('../config/reports.json'),
    persianDate = require('../services/persianDateService');


let handler = module.exports.handler = async((req, res) => {
    let dimensionCategoryQuery = new DimensionCategoryQuery(req.cookies['branch-id']),
        dimensionCategories = await(dimensionCategoryQuery.getAll()),
        localTranslate = clientTranslation;

    eventEmitter.emit('on-user-created',
        {id: req.user.id, name: req.user.name}, req);

    dimensionCategories.data.forEach((c, i) => localTranslate[`Dimension${i + 1}`] = c.title);

    if (!req.user.image)
        req.user.image = config.user.image;

    res.render('index.ejs', {
        today: persianDate.current(),
        clientTranslation: localTranslate,
        currentUser: req.user,
        currentBranch: memoryService.get('branches')
            .asEnumerable().single(b => b.id == req.cookies['branch-id']),
        dimensionCategories: dimensionCategories,
        version: config.version,
        reports: reports,
        env: config.env
    });
});

router.route('/').get(handler);

module.exports.router = router;
