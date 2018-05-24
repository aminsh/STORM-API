import {injectable, inject} from "inversify";
import Kavenegar from "kavenegar";
import toResult from "asyncawait/await";

const persistedConfig = instanceOf('persistedConfig');

@injectable()
export class KaveNegarSmsService {

    sender = undefined;
    api = undefined;


    constructor() {
        let apiKey = toResult(persistedConfig.get('KAVENEGAR_APIKEY')).value;

        this.api = Kavenegar.KavenegarApi({apikey: apiKey});

        this.sender = toResult(persistedConfig.get('KAVENEGAR_SENDER')).value;
    }


    send(receptor, message) {

        this.api.Send({message, receptor, sender: this.sender});
    }

}