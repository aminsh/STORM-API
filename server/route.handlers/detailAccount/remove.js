var async = require('asyncawait/async');
var await = require('asyncawait/await');
var repository = require('../../data/repository.detailAccount');

function remove(req, res) {
    var errors = [];

    //check for journal line
    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(repository.remove(req.params.id));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);