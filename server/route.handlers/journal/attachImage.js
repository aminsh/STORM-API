var async = require('asyncawait/async');
var await = require('asyncawait/await');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');

function attachImage(req, res) {
    var entity = await(repository.findById(req.params.id));

    entity.attachmentFileName = req.body.fileName;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

module.exports = async(attachImage);