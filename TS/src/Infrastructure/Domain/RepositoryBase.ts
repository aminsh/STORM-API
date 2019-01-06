import {inject, injectable} from "inversify";
import {EntityState} from "../EntityState";
import {BranchSupportEntity} from "./BranchSupportEntity";
import {FindConditions, getRepository, ObjectType, Repository} from "typeorm";

@injectable()
export class RepositoryBase<TEntity extends BranchSupportEntity> {

    @inject("State") state: State;

    protected repository: Repository<TEntity>;

    constructor(entity: ObjectType<TEntity>) {
        this.repository = getRepository(entity);
    }

    async findById(id: string): Promise<TEntity> {

        let options: any = {id, branchId: this.state.branchId};

        return this.repository.findOne(options);
    }

    protected setCreation(entity: TEntity, state: EntityState) {

        if (state === EntityState.CREATED) {
            entity.id = Utility.Guid.create();
            entity.branchId = this.state.branchId;
            entity.createdById = this.state.user.id;
        }

    }
}