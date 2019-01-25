import { Module } from "../Infrastructure/ModuleFramework";
import { FiscalPeriodRepository } from "./fiscalPeriod.repository";
import { FiscalPeriodService } from "./fiscalPeriod.service";
import { FiscalPeriodController } from "./fiscalPeriod.controller";

@Module({
    providers: [FiscalPeriodRepository, FiscalPeriodService],
    controllers: [FiscalPeriodController]
})
export class FiscalPeriodModule {}