import {Injectable} from "../../Infrastructure/DependencyInjection";
import {AccountCategory} from "./AccountCategory";
import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";

@Injectable()
export class AccountCategoryRepository extends RepositoryBase<AccountCategory> {
    constructor(){
        super(AccountCategory)
    }
}