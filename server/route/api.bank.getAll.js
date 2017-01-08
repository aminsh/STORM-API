var kendoQueryResolve = require('../../services/kendoQueryResolve');

module.exports = {
    route: '/banks',
    type: 'get',
    handler: (req, res, knexService)=> {

        var query = knexService.select().from('banks');

        var view = function (entity) {
            return {
                id: entity.id,
                title: entity.title
            };
        };

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result)
            });
    }
};
