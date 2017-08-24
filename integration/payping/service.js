"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    paypingConfig = require('./config.json'),
    request = require('request'),
    Promise = require('promise'),
    utility = instanceOf('utility'),
    config = instanceOf('config'),
    persistedConfigRepository = instanceOf('persistedConfig.repository'),
    branchThirdParty = instanceOf('branchThirdParty.repository');

module.exports = class PaypingService {
    constructor() {
        this.key = 'PAYPING_SERVICE_TOKEN';
        this.register = async(this.register);
    }

    getServiceToken() {
        const options = {
                uri: paypingConfig.getServiceTokenUrl,
                form: {
                    username: config.payping.username,
                    password: config.payping.password,
                    grant_type: 'password'
                },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },
            key = this.key;

        return new Promise((resolve, reject) => {

            request(options, async(function (error, response, body) {

                if (response.statusCode == 401)
                    return reject({statusCode: 401, statusMessage: 'Unauthorized'});

                if (response.statusCode == 400)
                    return reject({statusCode: 400, statusMessage: 'Bad Request'});

                let value = `bearer ${JSON.parse(body).access_token}`;

                await(persistedConfigRepository.set(key, value));

                resolve(value);
            }));
        })
    }

    getUserKey(username) {

        let serviceToken = await(persistedConfigRepository.get(this.key));

        if(!serviceToken){
            await(this.getServiceToken());
            serviceToken = await(persistedConfigRepository.get(this.key));
        }

        const options = {
            uri: paypingConfig.getUserKeyUrl.format(username),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': serviceToken.value
            }
        };

        return new Promise((resolve, reject) => {

            request(options, async((error, response, body) => {

                if (response.statusCode === 401)
                    return reject({statusCode: 401, statusMessage: 'Unauthorized'});

                if (response.statusCode === 400)
                    return reject({statusCode: 400, statusMessage: 'Bad Request'});

                return resolve({statusCode: 200, data: JSON.parse(body)});
            }));
        });
    }

    getRequestToken(parameter) {

        const options = {
            uri: paypingConfig.getRequestTokenUrl,
            form: parameter,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': await(persistedConfigRepository.get(this.key)).value
            }
        };

        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (response.statusCode == 401)
                    return reject({statusCode: 401, statusMessage: 'Unauthorized'});

                if (response.statusCode == 400)
                    return reject({statusCode: 400, statusMessage: 'Bad Request'});

                return resolve({statusCode: 200, data: JSON.parse(body)});
            });
        });

    }

    redirectToPayping(requestToken, response) {
        const url = paypingConfig.redirectToPaypingUrl.format(requestToken);

        response.redirect(url);
    }

    //public method

    register(branchId, data) {
        let result,
            username = data.username;

        try {
            result = await(this.getUserKey(username));
        } catch (e) {

            if (e.statusCode === 401) {
                await(this.getServiceToken());
                result = await(this.getUserKey(username));
            }
            else throw new Error(e);
        }

        await(branchThirdParty.create(branchId, 'payping', {username, userKey: result.data}));
    }

    pay(branchId, parameters, response) {
        let userKey = await(branchThirdParty.get(branchId, 'payping')).data.userKey,
            paymentParams = {
                UserKey: userKey,
                ReturnUrl: parameters.returnUrl,
                PayerName: parameters.customerName,
                Description: parameters.description,
                Amount: parameters.amount / 10, //Amount on payping is based on Toman
                ReferenceId: parameters.referenceId
            },
            paymentToken;

        try {
            paymentToken = await(this.getRequestToken(paymentParams)).data;
        } catch (e) {
            if (e.statusCode == 401) {
                await(this.getServiceToken());
                paymentToken = await(this.getRequestToken(paymentParams)).data;
            } else throw new Error(e);
        }

        this.redirectToPayping(paymentToken, response);
    }

    verify(userKey, reference) {
        const options = {
            uri: paypingConfig.verifyPayment,
            form: {RefId: reference.refId, UserKey: userKey},
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': await(persistedConfigRepository.get(this.key))
            }
        };

        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (response.statusCode == 401)
                    return reject({statusCode: 401, statusMessage: 'Unauthorized'});

                if (response.statusCode == 400)
                    return reject({statusCode: 400, statusMessage: 'Bad Request'});

                return resolve({statusCode: 200, data: {amount: body * 10, referenceId: reference.refId}});
            });
        });
    }
};