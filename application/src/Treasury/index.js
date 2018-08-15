import {BanksNameRepository} from "./BanksNameRepository";
import {BanksNameService} from "./BanksNameService";
import {BanksNameQuery} from "./BanksNameQuery";

import "./BanksNameController";

export function register(container) {

    container.bind("BanksNameRepository").to(BanksNameRepository);
    container.bind("BanksNameService").to(BanksNameService);
    container.bind("BanksNameQuery").to(BanksNameQuery);
}
