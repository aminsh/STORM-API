import {PaypingInterfacePaymentGateway} from "./paymentGateway/payping/PaypingInterfacePaymentGateway";
import {ZarinpalInterfacePaymentGateway} from "./paymentGateway/zarinpal/ZarinpalInterfacePaymentGateway";
import {KaveNegarSmsService} from "./smsService/KaveNegar";

export function register(container) {

    container.bind("PaypingInterfacePaymentGateway").to(PaypingInterfacePaymentGateway);
    container.bind("ZarinpalInterfacePaymentGateway").to(ZarinpalInterfacePaymentGateway);

    container.bind("Factory<ThirdParty>").toFactory(context => {
        return key => {
            if (key === 'payping')
                return context.container.get("PaypingInterfacePaymentGateway");

            if(key === 'zarinpal')
                return context.container.get("ZarinpalInterfacePaymentGateway");
        };
    });

    container.bind("Factory<PaymentGateway>").toFactory(context => {
        return key => {
            if (key === 'payping')
                return context.container.get("PaypingInterfacePaymentGateway");

            if(key === 'zarinpal')
                return context.container.get("ZarinpalInterfacePaymentGateway");
        };
    });

    container.bind("SmsService").to(KaveNegarSmsService);
}