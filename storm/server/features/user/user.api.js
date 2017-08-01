"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = require('../../config'),
    md5 = require('md5'),
    Guid = require('../../services/shared').utility.Guid,
    UserRepository = require('./user.repository'),
    UserQuery = require('./user.query'),
    translate = require('../../services/translateService'),
    emailService = require('../../services/emailService'),
    crypto = require('../../../../shared/services/cryptoService'),
    render = require('../../services/shared').service.render.renderFile,
    TokenRepository = require('../token/token.repository');

router.route('/').get(async((req, res) => {
    let userQuery = new UserQuery(),
        result = await(userQuery.getAll(req.query));

    res.json(result);
}));

router.route('/:id').delete(async((req, res) => {
    let userRepository = new UserRepository(),
        id = req.params.id;

    await(userRepository.remove(id));

    res.json({isValid: true});
}));

router.route('/register').post(async((req, res) => {
    let userRepository = new UserRepository(),
        cmd = req.body,
        user = {
            email: cmd.email,
            name: cmd.name,
            password: md5(cmd.password.toString()),
            state: 'pending',
            token: Guid.new()
        },
        url = `${config.url.origin}/activate/${user.token}`;

    await(userRepository.create(user));

    render("email-user-register-template.ejs", {
        user: {
            name: user.name
        },
        activateUrl: url,

    }).then((html) => {

        emailService.send({
            from: "info@storm-online.ir",
            to: user.email,
            subject: "لینک فعال سازی حساب کاربری در استورم",
            html: html
        });

    }).catch((err) => {

        console.log(`Error: The email DIDN'T send successfuly !!! `, err);

    });

    /*emailService.send({
        to: user.email,
        subject: translate('Activation link'),
        html: `<p><h3>${translate('Hello')}</h3></p>
               <p>${url}</p>`
    });*/

    res.json({isValid: true});
}));

router.route('/is-unique-email/:email')
    .get(async((req, res) => {
        let userQuery = new UserQuery(),
            user = await(userQuery.getByEmail(req.params.email));

        res.json({isValid: user !== null});
    }));

router.route('/:id/change-password')
    .put(async((req, res) => {
        let userRepository = new UserRepository(),
            cmd = req.body,
            id = req.params.id,
            entity = {
                password: md5(cmd.password)
            };

        try {

            await(userRepository.update(id, entity));
            res.json({isValid: true});

        } catch (e) {

            res.json({isValid: false});

        }

    }));

router.route('/:id/change-image')
    .put(async((req, res) => {

        let userRepository = new UserRepository()
            , imageName = req.body.imageName
            , id = req.body.id
            , entity = {
            image: imageName
        };

        try {

            await(userRepository.update(id, entity));
            res.json({isValid: true});

        } catch (e) {

            res.json({isValid: false});
            console.log(e.message);

        }

    }));

router.route('/forgot-password')
    .post(async((req, res) => {

        let userRepository = new UserRepository();
        let tokenRepository = new TokenRepository();
        let email = req.body.email;
        let token = null,
            user = await(userRepository.getUserByEmail(email)),
            email_options = {
                from: "info@storm-online.ir",
                subject: "",
                to: email,
                html: ""
            },
            link = "";


        if (user) {

            tokenRepository.create({
                type: "reset-pass",
                userId: user.id,
                token: ""
            })
            .then((token_rec) => {

                token = crypto.sign({
                    id: user.id,
                    tokenId: token_rec.id
                });

                tokenRepository.update(token_rec.id, {
                    token: token
                });

                link = `${config.url.origin}/reset-password/${token}`;
                email_options.html = `<a href="${link}" target="_blank" >${link}</a>`;

                emailService
                    .send(email_options);

                // Success
                return res.json({isValid: true});

            })
            .catch((err) => {

                return res.json({isValid: false, errors: ["There is a problem in inserting token"]});

            });

        }

        // With "No user found with this email" Error
        //res.json({isValid: true, error: ["Invalid email address", "No user found with this email address."]});
        return res.json({isValid: false, errors: ["Email not found"]});

    }));

router.route('/connected').get(async((req,res)=> {
    let userQuery = new UserQuery(),
        users = await(userQuery.getAllConnectedUsers());

    res.json(users);
}));

router.route('/total').get(async((req, res) => {
    let userQuery = new UserQuery(),
        result = await(userQuery.total());
    res.json({total: result.count});
}));

module.exports = router;