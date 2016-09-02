var async = require('asyncawait/async');
var await = require('asyncawait/await');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.detailAccount');

function activate(req, res) {
    var entity = await(repository.findById(req.params.id));

    entity.isActive = true;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}


function deactivate(req, res) {
    var entity = await(repository.findById(req.params.id));

    entity.isActive = false;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

module.exports.activate = async(activate);
module.exports.deactivate = async(deactivate);