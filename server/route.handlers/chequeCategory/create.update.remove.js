var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.chequeCategory');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var cheques = [];
    var lastPageNumber = cmd.firstPageNumber + cmd.totalPages - 1;

    for (var i = cmd.firstPageNumber; i <= lastPageNumber; i++)
        cheques.push({
            number: i,
            status: 'White'
        });

    var entity = {
        bankId: cmd.bankId,
        detailAccountId: cmd.detailAccountId,
        totalPages: cmd.totalPages,
        firstPageNumber: cmd.firstPageNumber,
        lastPageNumber: lastPageNumber,
        isClosed: false,
        cheques: cheques
    };

    entity = await(repository.create(entity, cheques));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

function update(req, res) {
    var errors = [];
    var cmd = req.body;

    if (errors.errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = await(repository.findById(req.params.id));

    entity.bankId = cmd.bankId;
    entity.detailAccountId = cmd.detailAccountId;

    await(repository.update(entity));

    res.json({
        isValid: true
    });
}

function remove(req, res) {
    var errors = [];

    if (errors.errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(repository.remove(req.params.id));

    res.json({
        isValid: true
    });
}

module.exports.create = async(create);
module.exports.update = async(update);
module.exports.remove = async(remove);