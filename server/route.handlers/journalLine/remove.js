var async = require('asyncawait/async');
var await = require('asyncawait/await');
var repository = require('../../data/repository.journalLine');
var journalRepository = require('../../data/repository.journal');
var translate = require('../../services/translateService');

function remove(req, res) {
    var errors = [];
    var cmd = req.body;

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(repository.remove(req.params.id));
    await(journalRepository.checkIsComplete(cmd.journalId));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);