var async = require('asyncawait/async');
var await = require('asyncawait/await');
var repository = require('../../data/repository.dimension');

function remove(req, res) {
    await(repository.remove(req.params.id));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);