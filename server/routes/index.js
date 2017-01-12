var config = require('../config'),
    clientTranslation = require('../config/translate.client.fa.json'),
    view = require('../viewModel.assemblers/view.dimensionCategory'),
    router = require('../services/routeService').Router(),
    await = require('asyncawait/await');

router.route({
    method: 'GET',
    path: '/',
    handler: (req, res, knex)=> {
        var dimensionCategories = await(knex.select().from('dimensionCategories'));
        var mappedDimensionCategories = {data: dimensionCategories.asEnumerable().select(view).toArray()};

        res.render('index.ejs', {
            clientTranslation: clientTranslation,
            currentUser: req.user.name,
            dimensionCategories: mappedDimensionCategories,
            version: config.version
        });
    }
});

module.exports = router.routes;
