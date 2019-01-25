import {Injectable} from "../../Infrastructure/DependencyInjection";
import {AccountCategory} from "./accountCategory.entity";
import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class AccountCategoryRepository extends RepositoryBase<AccountCategory> {
    protected readonly repository: Repository<AccountCategory> = getRepository(AccountCategory);
}