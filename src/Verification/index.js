import {VerificationRepository} from "./VerificationRepository";
import {VerificationService} from "./VerificationService";

export function register(container) {

    container.bind("VerificationRepository").to(VerificationRepository);
    container.bind("VerificationService").to(VerificationService);
}