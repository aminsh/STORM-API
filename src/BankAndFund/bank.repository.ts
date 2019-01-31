import { Bank } from "./bank.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { RepositoryBase } from "../Infrastructure/Domain/RepositoryBase";
import { getRepository, Repository } from "typeorm";

@Injectable()
export class BankRepository extends RepositoryBase<Bank> {
    protected readonly repository: Repository<Bank> = getRepository(Bank);
}