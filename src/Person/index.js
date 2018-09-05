import {PersonQuery} from "./PersonQuery";
import {PersonService} from "./PersonService";

import "./PersonController";

export function register(container) {

    container.bind("PersonQuery").to(PersonQuery);
    container.bind("PersonService").to(PersonService);
}