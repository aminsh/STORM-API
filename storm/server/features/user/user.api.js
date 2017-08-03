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
        let token = null;
        let user = await(userRepository.getUserByEmail(email));
        let link = "";
        // Check if a token already exists, delete them
        tokenRepository
            .deleteGenerated(user.id, "reset-pass")
            .then(() => {

                if (user) {

                    tokenRepository.create({
                        type: "reset-pass",
                        userId: user.id
                    })
                        .then((token_rec) => {

                            token = crypto.sign({
                                id: token_rec.id,
                                userId: user.id
                            });

                            tokenRepository.update(token_rec.id, {
                                token: token
                            })
                                .catch((err) => {

                                    console.log(err);

                                });

                            link = `${config.url.origin}/reset-password/${token}`;

                            render("email-reset-password-template.ejs", {
                                user: {
                                    name: user.name
                                },
                                originUrl: `${config.url.origin}`,
                                resetPassUrl: link

                            }).then((html) => {

                                emailService.send({
                                    from: "info@storm-online.ir",
                                    to: user.email,
                                    subject: "لینک تغییر رمز عبور در استورم",
                                    html: html
                                });

                            }).catch((err) => {

                                console.log(`Error: The email DIDN'T send successfuly !!! `, err);

                            });

                            // Success
                            res.json({isValid: true});

                        })
                        .catch((err) => {

                            console.log(err);
                            res.json({ isValid: false, errors: ["There is a problem in inserting token"] });

                        });

                } else {

                    // With "No user found with this email" Error
                    //res.json({isValid: true, error: ["Invalid email address", "No user found with this email address."]});
                    return res.json({isValid: false, errors: ["Email not found"]});

                }

            })
            .catch((err) => {

                console.log(err);
                res.json({ isValid: false, errors: ["A problem in deleting generated tokens"] });

            });

    }));

router.route('/encode-reset-password-token/:token')
    .get(async((req,res) => {

        let userRepository = new UserRepository(),
            tokenRepository = new TokenRepository(),
            token_data = crypto.verify(req.params.token),
            // Get Token Record + User Record from DB
            token_rec = await(tokenRepository.getById(token_data.id)),
            user = await(userRepository.getById(token_data.userId));

        if(token_rec && user && token_rec.type === "reset-pass"){

            return res.json({ isValid: true, returnValue: { id: token_rec.id } });

        }
        return res.json({ isValid: false, errors: ["Token is invalid"] });

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