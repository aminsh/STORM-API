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

    if(!req.isAuthenticated())
        return res.json({ isValid: false });

    if(req.user.role !== "admin")
        return res.json({ isValid: false });

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

router.route('/change-password')
    .put(async((req, res) => {
        let userRepository = new UserRepository(),
            cmd = req.body,
            currentPass = md5(cmd.currentPass),
            userId = req.user.id,
            user = await(userRepository.getById(userId)),
            entity = {
                password: md5(cmd.newPass)
            };

        if(!req.isAuthenticated())
            return res.json({ isValid: false });

        if(user.password !== currentPass)
            return res.json({ isValid: false });

        try {

            await(userRepository.update(userId, entity));
            res.json({isValid: true});

        } catch (err) {

            console.log(err);
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

        let userRepository = new UserRepository(),
            tokenRepository = new TokenRepository(),
            email = req.body.email,
            token = null,
            user = await(userRepository.getUserByEmail(email)),
            link = "",
            token_rec = null;

        try{

            if (!user)
                return res.json({isValid: false, errors: ["Email not found"]});

            // Check if a token already exists, delete them
            await(tokenRepository.deleteGenerated(user.id, "reset-pass"));

            try{

                token_rec = await(tokenRepository.create({ type: "reset-pass", userId: user.id }));

                token = crypto.sign({
                    id: token_rec.id,
                    userId: user.id
                });

                try{

                    await(tokenRepository.update(token_rec.id, { token: token }));

                } catch(err) {

                    console.log(err);
                    return;

                }

                link = `${config.url.origin}/reset-password/${token}`;

                try{

                    renderHtmlAndSendEmail();

                } catch(err) {

                    console.log(`Error: The email DIDN'T send successfuly !!! `, err);
                    return;

                }
                // Success
                res.json({isValid: true});

            } catch (err) {

                console.log(err);
                res.json({ isValid: false, errors: ["There is a problem in inserting token"] });

            }

        } catch (err) {

            console.log(err);
            res.json({ isValid: false, errors: ["A problem in deleting generated tokens"] });

        }

        // ******** END ******** //

        function renderHtmlAndSendEmail(){

            let error = null;

            await(render("email-reset-password-template.ejs", {
                        user: {
                            name: user.name
                        },
                        originUrl: `${config.url.origin}`,
                        resetPassUrl: link
                    })
                    .then((html) => {

                        emailService.send({
                            from: "info@storm-online.ir",
                            to: user.email,
                            subject: "لینک تغییر رمز عبور در استورم",
                            html: html
                        });

                    })
                    .catch((err) => {

                        error = err;

                    }));

            if(error !== null)
                throw Error(error);

        }

    }));

router.route('/decode-reset-password-token/:token')
    .get(async((req,res) => {

        try{

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

        } catch(err) {

            return res.json({ isValid: false, errors: ["Token is invalid"] });

        }

    }));

router.route('/reset-password')
    .post(async((req, res) => {

        if(req.isAuthenticated())
            return res.json({ isValid: false, errors: ["You are already logged in"] });

        try{

            let userRepository = new UserRepository(),
                tokenRepository = new TokenRepository(),
                token = req.body.token,
                token_data = await(crypto.verify(token)),
                user = await(userRepository.getById(token_data.userId)),
                newPass  = req.body.newPass,
                token_rec = await(tokenRepository.getById(token_data.id)),
                tokenCreateDate = new Date(token_rec.createdAt),
                nowDate = new Date();

            if( !(isValidToken(token_rec, user) && newPass.length >= 6) )
                return res.json({ isValid: false, errors: ["Token is invalid"] });

            if(isTokenDateExpired(nowDate, tokenCreateDate)){

                // The Token is Expired
                try{

                    deleteGeneratedResetPassTokens(tokenRepository, user);

                } catch(err) {

                    console.log(err);

                }
                return res.json({ isValid: false, errors: ["Token is invalid"] });

            }

            // The Token isn't Expired, yet ...
            await(userRepository.update(user.id, { password: md5(newPass.toString()) }));
            await(deleteGeneratedResetPassTokens(tokenRepository, user));
            res.json({ isValid: true });

        } catch(err) {

            console.log(err);
            return res.json({ isValid: false, errors: ["Token is invalid"] });

        }

        // ******** END ******** //

        function isTokenDateExpired(nowDate, tokenCreateDate){

            return (nowDate.getTime() - tokenCreateDate.getTime()) >= (3600*1000*24);

        }
        function deleteGeneratedResetPassTokens(tokenRepository, user){

            return tokenRepository.deleteGenerated(user.id,"reset-pass");

        }
        function isValidToken(token, user){

            return token.userId === user.id && token.type === "reset-pass";

        }

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

router.route('/test').get(async((req, res) => {

    res.json({ isValid: false });
    for(let p in req){
        console.log(`req.${p}`);
    }

}));

module.exports = router;