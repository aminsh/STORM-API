"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    md5 = require('md5'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    TokenGenerator = instanceOf('TokenGenerator'),
    renderFile = instanceOf('htmlRender').renderFile,
    Email = instanceOf('Email');


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

        let user = getUserView({token});

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

        if (!(email || mobile))
            return badRequestResponseAction('موبایل یا ایمیل وارد نشده');

        if (!(password))
            return badRequestResponseAction('کلمه عبور وارد نشده');

        let query = knex
            .select('id')
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

        user = getUserView({id: user.id});

        return res.json(user);
    }));

router.route('/logout')
    .post(async(function (req, res) {
        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["authorization"];

        if (!token)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('*').from('users').where({token}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        await(knex('users').where({id: user.id}).update({token: TokenGenerator.generate256Bit()}));

        res.sendStatus(200);
    }));

router.route('/register')
    .post(async(function (req, res) {

        let loginByGoogle = req.query.loginByGoogle,
            cmd = req.body,
            user = {},
            duration;

        try {

            if (loginByGoogle) {
                let profile = req.body.profile;

                user = await(knex.select('*').from('users').where({id: profile.id}).first());

                if (!user) {
                    user = {
                        id: profile.id,
                        googleToken: req.body.googleToken,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        state: 'pending',
                        isActiveEmail: true,
                        token: TokenGenerator.generate256Bit()
                    };

                    await(knex('users').insert(user));
                }
                else {
                    if (!user.isActiveEmail)
                        await(knex('users').where({id: user.id}).update({isActiveEmail: true}));
                }

            } else {

                user = {
                    id: TokenGenerator.generate128Bit(),
                    email: cmd.email,
                    mobile: cmd.mobile,
                    name: cmd.name,
                    password: md5(cmd.password.toString()),
                    state: 'pending',
                    token: TokenGenerator.generate256Bit()
                };

                if (user.email) {
                    let isEmailDuplicated = await(knex.select('id').from('users')
                        .where({state: 'active'})
                        .where('email', 'ILIKE', user.email).first());

                    if (isEmailDuplicated)
                        return res.status(400).send('ایمیل تکراری میباشد');
                }

                await(knex('users').insert(user));


                if (user.mobile) {


                    try {
                        req.container.get('VerificationDomainService').send(user.mobile, {userId: user.id});
                        duration = 60000;
                    }
                    catch (e) {
                        if (e instanceof ValidationException && e.errors[0] === 'This number is in queue')
                            return res.status(400).send('پیامک ارسال شده ، لطفا یک دقیقه دیگر تلاش کنید');

                        return res.sendStatus(500);
                    }

                }

            }

            user = getUserView({id: user.id});

            res.send({user, duration});
        }
        catch (e) {

            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

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

            res.send({message: 'کد فعالسازی به موبایل شما ارسال خواهد شد', duration: 60000});
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.status(500).send(e);
        }

    }));

router.route('/verify-mobile/:code')
    .post(async(function (req, res) {

        try {
            let result = req.container.get('VerificationDomainService').verify(req.params.code);

            await(knex('users').where({id: result.data.userId}).update({
                mobile: result.mobile,
                isActiveMobile: true,
                state: 'active'
            }));

            res.send(getUserView({id: result.data.userId}));
        }
        catch (e) {

            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.status(500).send(e);
        }

    }));

router.route('/change-password')
    .post(async(function (req, res) {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["authorization"];

        if (!token)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('*').from('users').where({token}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        let password = req.body.password;

        if (!password)
            return res.status(400).send('Password is empty');

        let customFields = user.custom_fields || {};

        customFields.shouldChangePassword = false;

        await(knex('users').where({id: user.id}).update({password: md5(password), custom_fields: customFields}));

        res.sendStatus(200);
    }));

router.route('/is-unique-email/:email')
    .get(async(function (req, res) {

        let isEmailDuplicated = await(knex.select('id').from('users').where('email', 'ILIKE', req.params.email).first());

        res.send(!isEmailDuplicated);
    }));

router.route('/is-unique-mobile/:mobile')
    .get(async(function (req, res) {

        let isMobileDuplicated = await(knex.select('id').from('users').where('mobile', req.params.mobile).first());

        res.send(!isMobileDuplicated);
    }));

router.route('/reset-password/by-mobile')
    .post(async(function (req, res) {

        let mobile = req.body.mobile;

        if (!mobile)
            return res.sendStatus(400);

        let user = await(knex.select('*').from('users').where({mobile}).first());

        if (!user)
            return res.status(400).send('The mobile is not exist');


        let newPassword = randomPassword(),
            customFields = user.custom_fields || {};

        customFields.shouldChangePassword = true;

        await(knex('users').where({id: user.id}).update({
            password: md5(newPassword.toString()),
            custom_fields: customFields
        }));

        req.container.get('SmsService').resetPassword(req.body.mobile, newPassword);

        res.sendStatus(200);

    }));


module.exports = router;

function randomPassword() {
    let text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getUserView(filter) {
    let user = await(
        knex
            .select('id', 'token', 'email', 'name', 'mobile', 'isActiveMobile', 'isActiveEmail', 'custom_fields')
            .from('users')
            .where(filter)
            .first()
        ),
        customFields = user.custom_fields;

    delete user.custom_fields;

    return Object.assign({}, user, customFields);
}