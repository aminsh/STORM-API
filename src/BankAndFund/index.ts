import { Module } from "../Infrastructure/ModuleFramework";
import { BankRepository } from "./bank.repository";
import { BankService } from "./bank.service";
import { FundRepository } from "./fund.repository";
import { FundService } from "./fund.service";
import { BankController } from "./bank.controller";
import { FundController } from "./fund.controller";

@Module({
    providers: [ BankRepository, BankService, FundRepository, FundService ],
    controllers: [ BankController, FundController ]
})
export class BankAndFundModule {
}
