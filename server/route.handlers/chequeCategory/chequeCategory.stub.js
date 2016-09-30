var chequeCategories = require('../../data.stub/cheque.category.json').categories;

module.exports.getAll = function (req, res) {
    res.json({data: chequeCategories});
};

module.exports.getById = function (req, res) {
    var cat = chequeCategories.asEnumerable()
        .single(function (c) {
            return c.id == req.params.id;
        });

    res.json(cat);
};

module.exports.create = function (req, res) {
    var cmd = req.body;

    console.log(JSON.stringify(cmd));

    res.json({
        isValid: true,
        returnValue: 4
    });
};

module.exports.update = function (req, res) {
    var cmd = req.body;

    console.log(JSON.stringify(cmd));

    res.json({
        isValid: true
    });
};

module.exports.remove = function (req, res) {
    console.log(req.params.id);

    res.json({
        isValid: true
    });
};