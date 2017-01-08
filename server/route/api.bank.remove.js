var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');

module.exports = {
    route: '/banks/:id',
    type: 'delete',
    handler: (req, res, bankRepository)=> {
        var repository = bankRepository,
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = await(repository.findById(req.params.id));

        entity.title = cmd.title;

        await(repository.update(entity));

        res.json({
            isValid: true
        });
    }
};