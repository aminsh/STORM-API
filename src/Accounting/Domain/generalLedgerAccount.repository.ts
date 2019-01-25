import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {GeneralLedgerAccount} from "./generalLedgerAccount.entity";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class GeneralLedgerAccountRepository extends RepositoryBase<GeneralLedgerAccount> {
    protected readonly repository: Repository<GeneralLedgerAccount> = getRepository(GeneralLedgerAccount);
}