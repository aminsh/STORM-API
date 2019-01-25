import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {DetailAccount} from "./detailAccount.entity";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class DetailAccountRepository extends RepositoryBase<DetailAccount> {
    protected readonly repository: Repository<DetailAccount> = getRepository(DetailAccount);
}