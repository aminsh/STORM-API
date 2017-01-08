module.exports = {
    route: '/banks/:id',
    type: 'get',
    handler: (req, res, knexService)=> {

        knexService.select().from('banks').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json({
                    id: entity.id,
                    title: entity.title
                });
            });
    }
};

