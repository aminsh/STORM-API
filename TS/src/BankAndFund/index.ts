import "./Domain/FundRepository";
import "./Domain/BankRepository";
import "./Application/BankService";
import "./Application/FundService";
import "./Controllers/BankController";
import "./Controllers/FundController";

import {Bank} from "./Domain/Bank";
import {Fund} from "./Domain/Fund";

export const entities: any = [Bank, Fund];