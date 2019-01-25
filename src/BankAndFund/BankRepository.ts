import {RepositoryBase} from "../../../oldSource/TS/src/Infrastructure/Domain/RepositoryBase";
import {Injectable} from "../../../oldSource/TS/src/Infrastructure/DependencyInjection";
import {EntityState} from "../../../oldSource/TS/src/Infrastructure/EntityState";
import {Bank} from "./Bank";

@Injectable()
export class BankRepository extends RepositoryBase<Bank> {
    constructor() {
        super(Bank);
    }

    async findById(id: string): Promise<Bank> {
        return this.repository.findOne({id, branchId: this.state.branchId});
    }

    async save(entity: Bank, state: EntityState): Promise<void> {

        super.setCreation(entity, state);

        await this.repository.save(entity);
    }

    async remove(entity: Bank): Promise<void> {

        await this.repository.remove(entity);
    }
}