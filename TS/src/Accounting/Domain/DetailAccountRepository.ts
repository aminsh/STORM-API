import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {DetailAccount} from "./DetailAccount";

@Injectable()
export class DetailAccountRepository extends RepositoryBase<DetailAccount> {
    constructor() {
        super(DetailAccount);
    }
}