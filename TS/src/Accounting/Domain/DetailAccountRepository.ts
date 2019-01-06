import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {EntityState} from "../../Infrastructure/EntityState";
import {DetailAccount} from "./DetailAccount";
import {FindConditions} from "typeorm";
import {Product} from "../../Product/Product";
import * as toResult from "asyncawait/await";

@Injectable()
export class DetailAccountRepository extends RepositoryBase<DetailAccount> {
    constructor() {
        super(DetailAccount);
    }

    async findById(id: string): Promise<DetailAccount> {
        return this.repository.findOne({id, branchId: this.state.branchId});
    }

    async findOne(conditions?: FindConditions<Product>): Promise<DetailAccount> {

        conditions = {...conditions, branchId: this.state.branchId};

        return this.repository.findOne(conditions);
    }

    async save(entity: DetailAccount, state: EntityState): Promise<void> {

        super.setCreation(entity, state);

        await this.repository.save(entity);
    }

    async remove(entity: DetailAccount): Promise<void> {

        await this.repository.remove(entity);
    }
}