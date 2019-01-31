import { Injectable } from "src/Infrastructure/DependencyInjection";
import { Request } from "src/Infrastructure/ExpressFramework/Types";
import { FiscalPeriodRepository } from "./fiscalPeriod.repository";
import { FiscalPeriod } from "./fiscalPeriod.entity";
import { ForbiddenException } from "src/Infrastructure/Exceptions";

@Injectable()
export class FiscalPeriodSelectorService {
    constructor(private readonly fiscalPeriodRepository: FiscalPeriodRepository) { }

    async handle(req: Request): Promise<void> {
        const fiscalPeriodIdOnRequest = req.body['fiscalPeriodId'] || req.query['fiscalPeriodId'] || req.cookies['current-period'];

        let fiscalPeriod: FiscalPeriod;

        if (!fiscalPeriodIdOnRequest)
            fiscalPeriod = await this.getDefault();

        fiscalPeriod = await this.fiscalPeriodRepository.findById(fiscalPeriodIdOnRequest);

        if (!fiscalPeriod)
            fiscalPeriod = await this.getDefault();

        if (!fiscalPeriod)
            throw new ForbiddenException('Fiscal period is not selectable');
    }

    private async getDefault(): Promise<FiscalPeriod> {
        return this.fiscalPeriodRepository.findOne({ isDefault: true });
    }
}