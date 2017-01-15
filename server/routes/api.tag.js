
var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/tags',
    handler: (req,res, knex, kendoQueryResolve)=> {
        var query = knex.select().from('tags');

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
