"use strict";

const config = require('../config'),
    translation = require('../config/translate.client.fa.json'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory'),
    reports = require('../config/reports.json'),
    persianDate = require('../services/shared').service.PersianDate,
    Object = require('../services/shared').utility.Object,
    BranchQuery = require('../../../storm/server/features/branch/branch.query'),
    branchQuery = new BranchQuery();

module.exports = async((req, res, next) => {
    let dimensionCategoryQuery = new DimensionCategoryQuery(req.cookies['branch-id']),
        dimensionCategories = await(dimensionCategoryQuery.getAll()),
        clientTranslation = Object.clone(translation),
        currentBranch = await(branchQuery.getById(req.cookies['branch-id']));

    dimensionCategories.data.forEach((c, i) => clientTranslation[`Dimension${i + 1}`] = c.title);

    res.locals = {
        today: persianDate.current(),
        clientTranslation,
        currentUser: req.user,
        currentBranch,
        dimensionCategories: dimensionCategories,
        version: config.version,
        reports: reports,
        env: config.env
    };

    next();
});