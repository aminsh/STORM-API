import {PaypingInterfacePaymentGateway} from "./paymentGateway/payping/PaypingInterfacePaymentGateway";
import {ZarinpalInterfacePaymentGateway} from "./paymentGateway/zarinpal/ZarinpalInterfacePaymentGateway";
import {Woocommerce} from "./shop/woocommerce/Woocommerce";
import {WoocommerceRepository} from "./shop/woocommerce/WoocommerceRepository";
import {KaveNegarSmsService} from "./smsService/KaveNegar";
import {PaypingService} from "./Payping/PaypingService";

import "./opencard/OpencardController";
import "./shop/woocommerce/WoocommerceController";
import "./Payping/PaypingRegisterController"
import "./Payping/PaypingController";

export function register(container) {

    container.bind("PaypingInterfacePaymentGateway").to(PaypingInterfacePaymentGateway);
    container.bind("ZarinpalInterfacePaymentGateway").to(ZarinpalInterfacePaymentGateway);

    container.bind("WoocommerceRepository").to(WoocommerceRepository);
    container.bind("Woocommerce").to(Woocommerce);
    container.bind("PaypingService").to(PaypingService);

    container.bind("Factory<ThirdParty>").toFactory(context => {
        return key => {
            if (key === 'payping')
                return context.container.get("PaypingInterfacePaymentGateway");

            if(key === 'zarinpal')
                return context.container.get("ZarinpalInterfacePaymentGateway");

            if(key === 'woocommerce')
                return context.container.get("Woocommerce");
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