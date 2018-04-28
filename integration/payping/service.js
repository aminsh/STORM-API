"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    paypingConfig = require('./config.json'),
    rp = require('request-promise'),
    utility = instanceOf('utility'),
    config = instanceOf('config'),
    persistedConfig = instanceOf('persistedConfig'),
    HttpException = instanceOf('httpException');


class PaypingService {
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

            await(persistedConfig.set(key, value));
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
    }

    get serviceToken() {
        let serviceToken = await(persistedConfig.get(this.key));

        if (!serviceToken) {
            await(this.setServiceToken());
            serviceToken = await(persistedConfig.get(this.key));
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

    register(token, data) {
        let result,
            username = data.username;

        try {
            result = await(this.setUserKey(username));
        } catch (e) {

            if (e.statusCode === 401) {
                await(this.setServiceToken());
                result = await(this.setUserKey(username));
            }
            else if (e.statusCode === 400) {
                throw new Error('Wrong username');
            }
            else
                throw new HttpException(e.statusCode, e.statusMessage, e.error);

        }

        let bankId,
            paypingAccount = instanceOf('HttpRequest')
                .get(`${process.env.ORIGIN_URL}/v1/banks`)
                .query({
                    first: '',
                    filter: {logic: 'and', filters: [{field: 'referenceId', operator: 'eq', value: 'payping'}]}
                })
                .setHeader('x-access-token', token)
                .execute();

        if (paypingAccount)
            bankId = paypingAccount.id;
        else {
            let bankResult = instanceOf('HttpRequest')
                .post(`${process.env.ORIGIN_URL}/v1/banks`)
                .setHeader('x-access-token', token)
                .body({
                    title: 'حساب پی پینگ',
                    referenceId: 'payping'
                })
                .execute();

            if (bankResult.isValid)
                bankId = bankResult.returnValue.id;
        }

        instanceOf('HttpRequest')
            .post(`${process.env.ORIGIN_URL}/v1/third-party`)
            .body({
                key: 'payping',
                data: {username, userKey: result, bankId}
            })
            .setHeader('x-access-token', token)
            .execute();
    }

    getPaymentUrl(userKey, parameters) {

        console.log('getPaymentUrl arguments');
        console.log(userKey);
        console.log(JSON.stringify(parameters));

        let paymentParams = {
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

        return paypingConfig.redirectToPaypingUrl.format(paymentToken);
    }

    savePayment(parameters) {
        const userKey = parameters.userKey,
            referenceId = parameters.refid,
            options = {
                uri: paypingConfig.verifyPayment,
                form: {RefId: referenceId, UserKey: userKey},
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': this.serviceToken
                }
            };

        try {
            let body = await(rp(options)),
                amount = JSON.parse(body) * 10;

            return {referenceId, amount};
        }
        catch (e) {
            throw new HttpException(e.statusCode, e.response.statusMessage, e.error);
        }
    }
}

module.exports = PaypingService;