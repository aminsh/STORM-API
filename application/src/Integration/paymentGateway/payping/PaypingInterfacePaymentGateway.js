import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const persistedConfig = instanceOf('persistedConfig');


@injectable()
export class PaypingInterfacePaymentGateway {

    @inject("HttpRequest")
    /** @type{HttpRequest}*/ request = undefined;

    @inject("RegisteredThirdPartyRepository")
    registeredThirdPartyRepository = undefined;

    serviceTokenKey = 'PAYPING_SERVICE_TOKEN';

    /**
     * @private
     */
    _setServiceToken() {

        try {
            let result = this.request
                    .post('https://api.payping.ir/token')
                    .body({
                        username: process.env["PAYPING_USERNAME"],
                        password: process.env["PAYPING_PASSWORD"],
                        grant_type: 'password'
                    })
                    .setHeader('Content-Type', 'application/x-www-form-urlencoded')
                    .execute(),
                value = `bearer ${result['access_token']}`;

            toResult(persistedConfig.set(this.serviceTokenKey, value));
        }
        catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @private
     */
    get _serviceToken() {
        let serviceToken = toResult(persistedConfig.get(this.serviceTokenKey));

        if (!serviceToken) {
            this._setServiceToken();
            serviceToken = toResult(persistedConfig.get(this.serviceTokenKey));
        }

        return serviceToken.value;
    }

    register(params) {
        let userKey = this.request
                .get(`https://api.payping.ir/v1/payment/GetUserKey`)
                .query({username: params.username})
                .setHeader('Accept', 'application/json')
                .setHeader('Authorization', this._serviceToken)
                .execute();

        params.userKey = userKey;
    }

    getPaymentUrl(parameters) {

        let thirdParty = this.registeredThirdPartyRepository.get('payping'),
            paymentParams = {
                UserKey: thirdParty.data.username,
                ReturnUrl: parameters.returnUrl,
                PayerName: parameters.payerName,
                Description: parameters.description,
                Amount: parameters.amount / 10, //Amount on payping is based on Toman
                ReferenceId: parameters.referenceId
            },
            requestToken = this.request
                .post('https://api.payping.ir/v1/payment/RequestToken')
                .body(paymentParams)
                .setHeader('Content-Type', 'application/x-www-form-urlencoded')
                .setHeader('Accept', 'application/json')
                .setHeader('Authorization', this._serviceToken)
                .execute();

        return `https://www.payping.ir/payment/PayApi/${requestToken}`;
    }

    verificate(params) {
        let thirdParty = this.registeredThirdPartyRepository.get(),
            referenceId = params.refid,
            amountAsToman = this.request
                .post('https://api.payping.ir/v1/payment/VerifyPayment')
                .body({RefId: referenceId, UserKey: thirdParty.data.userKey})
                .setHeader('Accept', 'application/json')
                .setHeader('Authorization', this._serviceToken)
                .execute();

        return {referenceId, amount: amountAsToman * 10, accountId: thirdParty.data.fundId};
    }
}