import { Module } from "../Infrastructure/ModuleFramework";
import { FiscalPeriodRepository } from "./fiscalPeriod.repository";
import { FiscalPeriodService } from "./fiscalPeriod.service";
import { FiscalPeriodController } from "./fiscalPeriod.controller";
import { FiscalPeriodSelectorService } from "./fiscalPeriod.selector.service";

@Module({
    providers: [FiscalPeriodRepository, FiscalPeriodService, FiscalPeriodSelectorService],
    controllers: [FiscalPeriodController]
})
export class FiscalPeriodModule {}