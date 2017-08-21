"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    paypingConfig = require('./config.json'),
    request = require('request'),
    Promise = require('promise'),
    utility = instanceOf('utility'),
    config = instanceOf('config'),
    persistedConfigRepository = instanceOf('persistedConfig.repository');

module.exports = class PaypingService {
    constructor() {
        this.key = 'PAYPING_SERVICE_TOKEN';
    }

    getServiceToken() {
        const options = {
                uri: paypingConfig.getServiceTokenUrl,
                form: {
                    username: config.PAYPING_USERNAME,
                    password: config.PAYPING_PASSWORD,
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
        return new Promise((resolve, reject) => {
            const options = {
                uri: paypingConfig.getUserKeyUrl.format(username),
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': await(persistedConfigRepository.get(this.key))
                }
            };

            request(options, async((error, response, body) => {

                if (response.statusCode == 401)
                    return reject({statusCode: 401, statusMessage: 'Unauthorized'});

                if (response.statusCode == 400)
                    return reject({statusCode: 400, statusMessage: 'Bad Request'});

                return resolve({statusCode: 400, data: body});
            }));
        });
    }

    getRequestToken(parameter) {

        const options = {
            uri: paypingConfig.getRequestTokenUrl,
            form: {
                UserKey: parameter.userKey,
                ReturnUrl: parameter.returnUrl,
                PayerName: parameter.customerName,
                Description: parameter.description,
                Amount: parameter.amount /10, //Amount on payping is based on Toman
                ReferenceId: parameter.referenceId
            },
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

                return resolve({statusCode: 200, data: body});
            });
        });

    }

    redirectToPayping(requestToken, redirect) {
        const url = paypingConfig.redirectToPaypingUrl.format(requestToken);

        redirect(url);
    }

    verify(userKey, referenceId) {
        const options = {
            uri: paypingConfig.verifyPayment,
            form: {RefId: referenceId, UserKey: userKey},
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

                return resolve({statusCode: 200, data: body});
            });
        });
    }
};