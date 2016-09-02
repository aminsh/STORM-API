var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.dimensionCategory');

function remove(req, res) {
    await(repository.remove(req.params.id));

    res.json({
        isValid: true
    });
}

module.exports = async(remove);
