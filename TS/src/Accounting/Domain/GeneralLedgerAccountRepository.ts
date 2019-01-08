import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {GeneralLedgerAccount} from "./GeneralLedgerAccount";
import {Injectable} from "../../Infrastructure/DependencyInjection";

@Injectable()
export class GeneralLedgerAccountRepository extends RepositoryBase<GeneralLedgerAccount> {
    constructor() {
        super(GeneralLedgerAccount);
    }
}