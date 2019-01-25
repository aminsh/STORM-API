import { RepositoryBase } from "../Infrastructure/Domain/RepositoryBase";
import { FiscalPeriod } from "./fiscalPeriod.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { Repository, getRepository } from "typeorm";

@Injectable()
export class FiscalPeriodRepository extends RepositoryBase<FiscalPeriod> {
    protected repository: Repository<FiscalPeriod> = getRepository(FiscalPeriod);
}