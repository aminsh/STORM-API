var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var dimensionCategories = require('./../data/data').dimensionCategories;
var express = require('express');
var router = express.Router();

router.route('/dimensions/category/:categoryId')
    .get(function (req, res) {
        var categoryId = req.params.categoryId;

        var cat = Enumerable.from(dimensionCategories)
            .first(function (cat) {
                return cat.id == categoryId
            });

        res.json({data: cat.dimensions});
    })
    .post(function (req, res) {
        var cmd = req.body;
        var categoryId = req.params.categoryId;
        var cat = Enumerable.from(dimensionCategories)
            .first(function (cat) {
                return cat.id == categoryId
            });

        console.log(cmd);

        cmd.categoryId = categoryId;
        cmd.id = guidService.newGuid();
        cat.dimensions.push(cmd);

        console.log(cmd);

        res.json({
            validationResult: {isValid: true},
            returnValue: {id: cmd.id}
        });
    });

router.route('/dimensions/:id')
    .get(function (req, res) {
        var id = req.params.id;
        var dimension = Enumerable.from(dimensionCategories)
            .selectMany(function (cat) {
                return cat.dimensions
            })
            .first(function (d) {
                return d.id == id;
            });

        res.json(dimension);
    })
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        console.log(cmd);

        var dimension = Enumerable.from(dimensionCategories)
            .selectMany(function (cat) {
                return cat.dimensions
            })
            .first(function (d) {
                return d.id == id;
            });

        dimension.code = cmd.code;
        dimension.title = cmd.title;
        dimension.description = cmd.description;

        res.json({
            validationResult: {isValid: true}
        });
    });

router.route('/dimensions/:id/activate')
    .put(function (req, res) {
        var dimension = Enumerable.from(dimensionCategories)
            .selectMany(function (cat) {
                return cat.dimensions
            })
            .first(function (d) {
                return d.id == id;
            });

        dimension.isActive = true;

        res.json({
            validationResult: {isValid: true}
        });
    });

router.route('/dimensions/:id/deactivate')
    .put(function (req, res) {
        var dimension = Enumerable.from(dimensionCategories)
            .selectMany(function (cat) {
                return cat.dimensions
            })
            .first(function (d) {
                return d.id == id;
            });

        dimension.isActive = false;

        res.json({
            validationResult: {isValid: true}
        });
    });

module.exports = router;