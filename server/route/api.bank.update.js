var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');

module.exports = {
    route: '/banks/:id',
    type: 'put',
    handler: (req, res, bankRepository)=> {
        var errors = [];

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(bankRepository.remove(req.params.id));

        res.json({
            isValid: true
        });
    }
};