import { Injectable } from "../../../Infrastructure/DependencyInjection";
import { KavenegarApi } from 'kavenegar'

@Injectable()
export class Kavenegar {
    send(apiKey: string, sender: string, receptor: string, message: string): void {
        const api = KavenegarApi({ apikey: apiKey });
        api.Send(message, receptor, sender);
    }

    verifyLookup(apiKey: string, receptor: string, code: string, template: string): void {
        const api = KavenegarApi({ apikey: apiKey });
        api.VerifyLookup({
            receptor,
            token: code,
            template
        }, function (response: string, status: string) {
            console.log(response);
            console.log(status);
        });
    }
}
