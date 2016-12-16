var express = require('express'),
    router = express.Router(),
    authenticate = require('../config/auth').authenticate,
    md5 = require('md5'),
    db = require('../models'),
    guid = require('../utilities/guidService'),
    knexService = require('../services/knexService');

router.route('/register')
    .get(function (req, res) {
        res.render('register.ejs');
    })
    .post(function (req, res) {
        var cmd = req.body;

        var user = {
            id: guid.newGuid(),
            email: cmd.email,
            name: cmd.name,
            password: md5(cmd.password),
            state: 'pending',
            token: guid.newGuid()
        };

        db.user.create(user)
            .then(function () {
                res.json({isValid: true})
                // send email
            });
    });

router.route('/login').post(authenticate);

router.route('/logout').post(function (req, res) {
    if (req.isAuthenticated())
        req.logout();
    res.json({isValid: true});
});

router.route('/is-unique-email/:email')
    .get(function (req, res) {
        db.user.findOne({
            where: {
                email: req.params.email
            }
        }).then(function (result) {
            res.json({isValid: result != undefined});
        });
    });

router.route('/by-email/:email')
    .get(function (req, res) {
        knexService
            .select('id','email', 'name')
            .from('users')
            .where('email','ILIKE', req.params.email)
        .then(function (result) {
            res.json(result[0])
        });
    });

module.exports = router;