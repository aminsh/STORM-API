var express = require('express');
var router = express.Router();
var md5 = require('md5');
var db = require('../models');

router.route('/')
    .get(function (req, res) {
        res.render('register.ejs');
    })
    .post(function (req, res) {
        var cmd = req.body;

        var user = {
            name: cmd.name,
            username: cmd.username,
            password: md5(cmd.password)
        };

        db.user.create(user)
            .then(function () {
                res.json({isValid: true})
            });
    });

router.route('/is-unique-username/:username')
    .get(function (req, res) {
        db.user.findOne({
            where: {
                username: req.params.username
            }
        }).then(function (result) {
            res.json({isValid: result != undefined});
        });
    });


module.exports = router;