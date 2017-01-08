var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');

module.exports ={
    route: '/banks',
    type:'post',
    handler: (req, res, bankRepository)=> {
        var errors = [];
        var cmd = req.body;
        var repository = bankRepository;

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

        var entity = {
            title: cmd.title
        };

        entity = await(repository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
};