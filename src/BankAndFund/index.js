import {BankService} from "./BankService";
import {FundService} from "./FundService";
import {BankAndFundQuery} from "./BankAndFundQuery";

import "./BankController";
import "./FundController";
import "./BankAndFundController";

export function register(container) {

    container.bind("BankService").to(BankService);
    container.bind("FundService").to(FundService);
    container.bind("BankAndFundQuery").to(BankAndFundQuery);
}