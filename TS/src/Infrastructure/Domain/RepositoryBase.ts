import {BranchSupportEntity} from "./BranchSupportEntity";
import {DeepPartial, FindConditions, getRepository, ObjectType, Repository} from "typeorm";
import {getCurrentContext} from "../ApplicationCycle";
import {Injectable} from "../DependencyInjection";

@Injectable()
export class RepositoryBase<TEntity extends BranchSupportEntity> {

    protected repository: Repository<TEntity>;

    protected get currentContext(): IContext {
        return getCurrentContext();
    }

    constructor(entity: ObjectType<TEntity>) {
        this.repository = getRepository(entity);
    }

    async findById(id: string): Promise<TEntity> {

        let options: any = {id, branchId: this.currentContext.branchId};

        return this.repository.findOne(options);
    }

    async find(conditions?: FindConditions<TEntity>): Promise<TEntity[]> {
        let options: any = Object.assign({}, conditions, {branchId: this.currentContext.branchId});

        return this.repository.find(options);
    }

    async findOne(conditions?: FindConditions<TEntity>): Promise<TEntity> {
        let options: any = Object.assign({}, conditions, {branchId: this.currentContext.branchId});

        return this.repository.findOne(options);
    }

    async save(entity: DeepPartial<TEntity>): Promise<void> {
        await this.repository.save(entity)
    }

    async remove(entity: TEntity): Promise<void> {
        await this.repository.remove(entity)
    }
}