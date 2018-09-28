import {LoggerRepository} from "./LoggerRepository";
import {LoggerService} from "./LoggerService";

export function register(container) {

    container.bind("LoggerRepository").to(LoggerRepository);
    container.bind("LoggerService").to(LoggerService);
}
