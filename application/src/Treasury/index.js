import {BanksNameRepository} from "./BanksNameRepository";
import {BanksNameService} from "./BanksNameService";
import {BanksNameQuery} from "./BanksNameQuery";
import {PayableChequeCategoryRepository} from "./PayableChequeCategoryRepository";
import {PayableChequeCategoryQuery} from "./PayableChequeCategoryQuery";
import {PayableChequeCategoryService} from "./PayableChequeCategoryService";
import {PayableChequeService} from "./PayableChequeService";
import {ChequeEventListener} from "./ChequeEventListener";

import "./BanksNameController";
import "./PayableChequeCategoryController";

export function register(container) {

    container.bind("BanksNameRepository").to(BanksNameRepository);
    container.bind("BanksNameService").to(BanksNameService);
    container.bind("BanksNameQuery").to(BanksNameQuery);

    container.bind("PayableChequeCategoryRepository").to(PayableChequeCategoryRepository);
    container.bind("PayableChequeCategoryQuery").to(PayableChequeCategoryQuery);
    container.bind("PayableChequeCategoryService").to(PayableChequeCategoryService);
    container.bind("PayableChequeService").to(PayableChequeService);
    container.bind("ChequeEventListener").to(ChequeEventListener);
}
