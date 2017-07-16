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
    emailService = require('../../services/emailService');

router.route('/').get(async((req, res)=> {
    let userQuery = new UserQuery(),
        users = await(userQuery.getAll());

    res.json(users);
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
        url= `${config.url.origin}/activate/${user.token}`;

    await(userRepository.create(user));

    emailService.send({
        to: user.email,
        subject: translate('Activation link'),
        html: `<p><h3>${translate('Hello')}</h3></p>
               <p>${url}</p>`
    });

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

        try{

            await(userRepository.update(id, entity));
            res.json({isValid: true});

        } catch(e) {

            res.json({isValid: false});

        }

    }));

router.route('/:id/change-image')
    .put(async((req, res) => {

        let userRepository = new UserRepository()
            ,imageName = req.body.imageName
            ,id = req.body.id
            ,entity = {
            image: imageName
        };

        try{

            await(userRepository.update(id, entity));
            res.json({ isValid: true });

        } catch(e) {

            res.json({ isValid: false });
            console.log(e.message);

        }

    }));

module.exports = router;