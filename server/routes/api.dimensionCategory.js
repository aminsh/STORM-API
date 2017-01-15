
var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.dimensionCategory');

router.route({
    method: 'GET',
    path: '/dimension-categories',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var query = knex.select().from('dimensionCategories');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'POST',
    path: '/dimension-categories',
    handler: (req, res, dimensionCategoryRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(dimensionCategoryRepository.create({
            title: cmd.title
        }));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        })
    }
});

router.route({
    method: 'GET',
    path: '/dimension-categories/:id',
    handler: (req, res, knex)=> {
        knex.select().from('dimensionCategories').where('id', req.params.id)
            .then((result)=> {
                res.json(view(result[0]))
            });
    }
});

router.route({
    method: 'PUT',
    path: '/dimension-categories/:id',
    handler: (req, res, dimensionCategoryRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(dimensionCategoryRepository.findById(cmd.id));

        entity.title = cmd.title;

        await(dimensionCategoryRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/dimension-categories/:id',
    handler: (req, res, dimensionCategoryRepository)=> {
        await(dimensionCategoryRepository.remove(req.params.id));

        res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;

