import {injectable, inject,postConstruct} from "inversify";
import Kavenegar from "kavenegar";
import toResult from "asyncawait/await";

@injectable()
export class KaveNegarSmsService {

    sender = undefined;
    api = undefined;
    
    @inject("PersistedConfigService") 
    /**@type{PersistedConfigService}*/persistedConfigService = undefined;

    @postConstruct()
    init() {

        let apiKey = toResult(this.persistedConfigService.get('KAVENEGAR_APIKEY')).value;

        this.api = Kavenegar.KavenegarApi({apikey: apiKey});

        this.sender = toResult(this.persistedConfigService.get('KAVENEGAR_SENDER')).value;
    }


    send(receptor, message) {

        this.api.Send({message, receptor, sender: this.sender});
    }

    sendVerification(receptor, code) {

        console.log(code);

        this.api.VerifyLookup({
            receptor: receptor,
            token: code,
            template: "smsVerify"
        }, function(response, status) {
            console.log(response);
            console.log(status);
        });
    }

    resetPassword(receptor, password) {

        console.log(password);

        this.api.VerifyLookup({
            receptor: receptor,
            token: password,
            template: "resetPassword"
        }, function(response, status) {
            console.log(response);
            console.log(status);
        });
    }

}