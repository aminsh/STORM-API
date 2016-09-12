var cheques = require('../../data.stub/cheque.json').cheques;

module.exports.getAll = function (req, res) {
    res.json({data: cheques});
};

module.exports.getById(function (req, res) {
    res.json(cheques.asEnumerable().first(function (c) {
        return c.id == req.params.id;
    }));
});

module.exports.create = function (req, res) {
    console.log(req.body);

    res.json({
        isValid: true,
        returnValue: 4
    });
};

module.exports.update = function (req, res) {
    console.log(req.params.id);
    console.log(req.body);

    res.json({
        isValid: true
    });
};

module.exports.remove = function (req, res) {
    console.log(req.params.id);
    console.log(req.body);

    res.json({
        isValid: true
    });
};
