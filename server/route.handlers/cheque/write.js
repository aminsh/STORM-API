var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.cheque');

function write(req, res) {
    var errors = [];
    var cmd = req.body;

    if (errors.errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = await(repository.findById(req.params.id));

    entity.data = cmd.date;
    entity.amount = cmd.amount;
    entity.descriprion = cmd.description;
    entity.status = 'Used';
    entity.journalLineId = cmd.journalLineId;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

module.exports = async(write);