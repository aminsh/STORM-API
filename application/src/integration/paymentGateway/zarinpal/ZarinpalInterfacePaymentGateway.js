import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";
import ZarinPalCheckout from "zarinpal-checkout";

@injectable()
export class ZarinpalInterfacePaymentGateway {

    @inject("HttpRequest")
    /** @type{HttpRequest}*/ request = undefined;

    @inject("RegisteredThirdPartyRepository")
    registeredThirdPartyRepository = undefined;

    register(params) {
        // not have register for zarinpal
    }

    getPaymentUrl(parameters) {

        let thirdParty = this.registeredThirdPartyRepository.get('zarinpal'),
            isSandbox = process.env.NODE_ENV === 'development',
            zarinInstance = ZarinPalCheckout.create(thirdParty.data.merchantId, isSandbox),

            response = toResult(zarinInstance.PaymentRequest({
                Amount: (parameters.amount / 10).toString(),
                CallbackURL: parameters.returnUrl,
                Description: parameters.description,
                /* Email: 'hi@siamak.work',
                 Mobile: '09126408566'*/
            }));

        return response.url;
    }

    verificate(params) {

        if(params.Status === 'NOK')
            return {success: false};

        let thirdParty = this.registeredThirdPartyRepository.get('zarinpal'),
            isSandbox = process.env.NODE_ENV === 'development',
            zarinInstance = ZarinPalCheckout.create(thirdParty.data.merchantId, isSandbox),
            response = toResult(zarinInstance.PaymentVerification(params));

        return {referenceId: response.RefID, amount: params.Amount * 10, accountId: thirdParty.data.fundId, success: true};
    }
}