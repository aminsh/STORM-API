import {BranchSupportEntity} from "./BranchSupportEntity";
import {
    DeepPartial,
    FindConditions, FindManyOptions,
    FindOneOptions,
    Repository
} from "typeorm";
import {getCurrentContext, getUnitOfWork} from "../ApplicationCycle";
import {Injectable} from "../DependencyInjection";

@Injectable()
export abstract class RepositoryBase<TEntity extends BranchSupportEntity> {
    protected abstract readonly repository: Repository<TEntity>;

    async findById(id: string): Promise<TEntity | undefined> {
        let options: FindOneOptions<TEntity> = {id, branchId: getCurrentContext().branchId} as FindOneOptions<TEntity>;
        return this.repository.findOne(options);
    }

    async find(conditions?: FindConditions<TEntity>): Promise<TEntity[]> {
        let options: FindConditions<TEntity> = Object.assign({}, conditions, {branchId: getCurrentContext().branchId}) as FindConditions<TEntity>;
        return this.repository.find(options);
    }

    async findOne(conditions?: FindConditions<TEntity>): Promise<TEntity | undefined> {
        let options: FindOneOptions<TEntity> = Object.assign({}, conditions, {branchId: getCurrentContext().branchId}) as FindOneOptions<TEntity>;
        return this.repository.findOne(options);
    }

    async save(entity: DeepPartial<TEntity>): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            return await getUnitOfWork().attach(entity);

        await this.repository.save(entity);
    }

    async remove(entity: TEntity): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            await getUnitOfWork().attach(entity, true);

        await this.repository.remove(entity);
    }
}