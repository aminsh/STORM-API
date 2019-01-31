import { Fund } from "./fund.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { RepositoryBase } from "../Infrastructure/Domain/RepositoryBase";
import { getRepository, Repository } from "typeorm";

@Injectable()
export class FundRepository extends RepositoryBase<Fund> {
    protected readonly repository: Repository<Fund> = getRepository(Fund);
}