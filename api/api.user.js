"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    md5 = require('md5'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    TokenGenerator = instanceOf('TokenGenerator');

router.route('/')
    .get(async(function (req, res) {
        let query = knex.from(function () {
                this.select('id', 'name', 'email', 'image').from('users').as('base');
            }),

            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);
    }));

router.route('/current')
    .get(async(function (req, res) {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["authorization"];

        if (!token)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('id', 'token', 'email', 'name', 'mobile').from('users').where({token}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        res.send(user);

    }));


router.route('/login')
    .post(async(function (req, res) {
        let badRequestResponseAction = (message) => res.status(400).send(message),

            email = req.body.email,
            mobile = req.body.mobile,
            password = req.body.password;

        if(!(email || mobile))
            return badRequestResponseAction('موبایل یا ایمیل وارد نشده');

        if (!(password))
            return badRequestResponseAction('کلمه عبور وارد نشده');

        let query = knex
            .select('id', 'token', 'email', 'name', 'mobile')
            .from('users')
            .where('state', 'active')
            .where('password', md5(password.toString()));

        if (email)
            query.where('email', 'ILIKE', email);

        if (mobile)
            query.where('mobile', mobile);

        let user = await(query.first());

        if (!user)
            return badRequestResponseAction('{0} یا کلمه عبور صحیح نیست'.format(email ? 'ایمیل' : 'موبایل'));

        return res.json(user);
    }));


router.route('/register')
    .post(async(function (req, res) {

        let cmd = req.body,
            user = {
                id: TokenGenerator.generate128Bit(),
                email: cmd.email,
                mobile: cmd.mobile,
                name: cmd.name,
                password: md5(cmd.password.toString()),
                state: 'pending',
                token: TokenGenerator.generate256Bit()
            };

        try {
            let isEmailDuplicated = await(knex.select('id').from('users').where('email', 'ILIKE', user.email).first());

            if (isEmailDuplicated)
                return res.status(400).send('The email is duplicated');

            await(knex('users').insert(user));

            if(user.mobile)
                req.container.get('VerificationDomainService').send(user.mobile, {userId: user.id});

            res.send({id: user.id, name: user.name, email: user.email, mobile: user.mobile, token: user.token});
        }
        catch (e) {
            console.log(e);

            return res.status(500).send('Internal server error');
        }

    }));

router.route('/mobile-entry')
    .post(async(function (req, res) {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["authorization"];

        if (!token)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('*').from('users').where({token}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        let mobile = req.body.mobile || user.mobile;

        if (!mobile)
            return res.status(400).send('موبایل وارد نشده');

        try {
            req.container.get('VerificationDomainService').send(req.body.mobile, {userId: user.id});

            res.send('کد فعالسازی به موبایل شما ارسال خواهد شد');
        }
        catch (e) {
            res.status(500).send(e);
        }

    }));

router.route('/verify-mobile/:code')
    .post(async(function (req, res) {

        try {
            let result = req.container.get('VerificationDomainService').verify(req.params.code);

            await(knex('users').where({id: result.data.userId}).update({mobile: result.mobile, state: 'active'}));

            res.sendStatus(200);
        }
        catch (e) {

            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.status(500).send(e);
        }

    }));

router.route('/change-password')
    .post(async(function (req, res) {

        let token = req.body.token,
            password = req.body.password,
            decode;

        if (!password)
            return res.status(400).send('Password is empty');

        try {
            decode = Crypto.verify(token);
        }
        catch (e) {
            return res.status(400).send('Token is not valid');
        }

        let userId = decode.userId;

        await(knex('users').where({id: userId}).update({password: md5(password)}));

        res.send('Your password has changed successfully');
    }));

router.route('/is-unique-email/:email')
    .get(async(function (req, res) {

        let isEmailDuplicated = await(knex.select('id').from('users').where('email', 'ILIKE', req.params.email).first());

        res.send(!isEmailDuplicated);
    }));


module.exports = router;