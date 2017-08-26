"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    paypingConfig = require('./config.json'),
    rp = require('request-promise'),
    Promise = require('promise'),
    utility = instanceOf('utility'),
    config = instanceOf('config'),
    HttpException = instanceOf('httpException'),
    persistedConfigRepository = instanceOf('persistedConfig.repository'),
    branchThirdParty = instanceOf('branchThirdParty.repository');


module.exports = class PaypingService {
    constructor() {
        this.key = 'PAYPING_SERVICE_TOKEN';
    }

    // private methods

    setServiceToken() {
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

        try {
            let body = await(rp(options)),
                value = `bearer ${JSON.parse(body).access_token}`;

            await(persistedConfigRepository.set(key, value));
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
    }

    get serviceToken() {
        let serviceToken = await(persistedConfigRepository.get(this.key));

        if (!serviceToken) {
            await(this.setServiceToken());
            serviceToken = await(persistedConfigRepository.get(this.key));
        }

        return serviceToken.value;
    }

    setUserKey(username) {

        const options = {
            uri: paypingConfig.getUserKeyUrl.format(username),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': this.serviceToken
            }
        };

        try {
            let body = await(rp(options));
            return JSON.parse(body);
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
    }

    getRequestToken(parameter) {

        const options = {
            uri: paypingConfig.getRequestTokenUrl,
            form: parameter,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': this.serviceToken
            }
        };

        try {
            let body = await(rp(options));
            return JSON.parse(body);
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
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
            result = await(this.setUserKey(username));
        } catch (e) {

            if (e.statusCode === 401) {
                await(this.setServiceToken());
                result = await(this.getUserKey(username));
            }
            else
                throw new HttpException(e.statusCode, e.statusMessage, e.error);
        }

        const bankId = await(instanceOf('service.detailAccount', branchId)
            .create('حساب پی پینگ', 'bank'));

        await(branchThirdParty.create(branchId, 'payping', {username, userKey: result, bankId}));
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
            paymentToken = await(this.getRequestToken(paymentParams));
        } catch (e) {
            if (e.statusCode == 401) {
                await(this.setServiceToken());
                paymentToken = await(this.getRequestToken(paymentParams));
            } else
                throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }

        this.redirectToPayping(paymentToken, response);
    }

    savePayment(branchId, reference) {
        const userKey = await(branchThirdParty.get(branchId, 'payping')).data.userKey,
            referenceId = reference.refid,
            options = {
                uri: paypingConfig.verifyPayment,
                form: {RefId: referenceId, UserKey: userKey},
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': this.serviceToken
                }
            };

        try {
            let body = await(rp(options)),
                amount = JSON.parse(body) * 10;

            return {
                number: referenceId,
                date: utility.PersianDate.current(),
                amount,
                paymentType: 'receipt',
                receiveOrPay: 'receive',
                bankId: await(branchThirdParty.get(branchId, 'payping')).data.bankId
            };
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
    }
};