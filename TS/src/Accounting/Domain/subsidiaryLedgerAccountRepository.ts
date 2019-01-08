import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {SubsidiaryLedgerAccount} from "./SubsidiaryLedgerAccount";
import {Injectable} from "../../Infrastructure/DependencyInjection";

@Injectable()
export class SubsidiaryLedgerAccountRepository extends RepositoryBase<SubsidiaryLedgerAccount> {
    constructor() {
        super(SubsidiaryLedgerAccount)
    }
}