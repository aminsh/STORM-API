import {EmailService} from "./EmailService";

export function register(container) {

    container.bind("EmailService").to(EmailService).inSingletonScope();
}