var banks = require('../../data.stub/cheque.category.json').banks;

module.exports.getAll = function (req, res) {
    res.json({data: banks});
};

module.exports.getById = function (req, res) {
    res.json(banks.asEnumerable().first(function (b) {
        return b.id == req.params.id;
    }))
};

module.exports.create = function (req, res) {
    console.log(JSON.stringify(req.body));

    res.json({
        isValid: true,
        returnValue: 4
    });
};

module.exports.update = function (req, res) {
    console.log(JSON.stringify(req.params.id));
    console.log(JSON.stringify(req.body));

    res.json({
        isValid: true,
    });
};

module.exports.remove = function (req, res) {
    console.log(JSON.stringify(req.params.id));
    console.log(JSON.stringify(req.body));

    res.json({
        isValid: true,
    });
};

