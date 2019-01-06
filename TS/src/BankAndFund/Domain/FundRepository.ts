import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Injectable} from "../../Infrastructure/DependencyInjection";
import {EntityState} from "../../Infrastructure/EntityState";
import {Fund} from "./Fund";

@Injectable()
export class FundRepository extends RepositoryBase<Fund> {
    constructor() {
        super(Fund);
    }

    async findById(id: string): Promise<Fund> {
        return this.repository.findOne({id, branchId: this.state.branchId});
    }

    async save(entity: Fund, state: EntityState): Promise<void> {

        super.setCreation(entity, state);

        await this.repository.save(entity);
    }

    async remove(entity: Fund): Promise<void> {

        await this.repository.remove(entity);
    }
}