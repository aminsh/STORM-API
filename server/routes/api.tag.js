/*
var express = require('express');
var router = express.Router();
var tagRouteHandler = require('../route.handlers/tag');

router.route('/tags').get(tagRouteHandler.getAll)

module.exports = router;
*/

var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/tags',
    handler: (req,res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from('tags');

        var view = function (t) {
            return {
                id: t.id,
                title: t.title
            };
        };

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

module.exports = router.routes;
