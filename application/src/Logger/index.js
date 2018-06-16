import {container} from "../di.config";

import {LoggerRepository} from "./LoggerRepository";
import {LoggerService} from "./LoggerService";

container.bind("LoggerRepository").to(LoggerRepository);
container.bind("LoggerService").to(LoggerService);