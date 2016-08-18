var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var dimensionCategories = require('./../data/data').dimensionCategories;
var express = require('express');
var router = express.Router();

router.route('/dimension-categories')
    .get(function (req, res) {
        res.json({data: dimensionCategories});
    })
    .post(function (req, res) {
        var cmd = req.body;
        cmd.id = guidService.newGuid();
        console.log(cmd);

        dimensionCategories.push(cmd);

        console.log(cmd);

        res.json({
            validationResult: {isValid: true},
            returnValue: {id: cmd.id}
        });
    });

router.route('/dimension-categories/:id')
    .get(function (req, res) {
        var id = req.params.id;
        var cat = Enumerable.from(dimensionCategories)
            .first(function (item) {
                return item.id == id;
            });

        res.json(cat);
    })
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        console.log(cmd);

        var cat = Enumerable.from(dimensionCategories)
            .first(function (item) {
                return item.id == id;
            });

        cat.title = cmd.title;

        res.json({
            validationResult: {isValid: true}
        });
    });


module.exports = router;