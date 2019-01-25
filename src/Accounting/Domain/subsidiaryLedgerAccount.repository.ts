import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {SubsidiaryLedgerAccount} from "./subsidiaryLedgerAccount.entity";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class SubsidiaryLedgerAccountRepository extends RepositoryBase<SubsidiaryLedgerAccount> {
    protected readonly repository: Repository<SubsidiaryLedgerAccount> = getRepository(SubsidiaryLedgerAccount);
}