import {Injectable} from "../../Infrastructure/DependencyInjection";
import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Journal} from "./Journal";
import {EntityState} from "../../Infrastructure/EntityState";
import {FindConditions, getRepository, Repository, Transaction, TransactionRepository} from "typeorm";

@Injectable()
export class JournalRepository extends RepositoryBase<Journal> {
    constructor() {
        super(Journal);
    }

    async findById(id: string): Promise<Journal> {
        return this.repository.findOne({id, branchId: this.state.branchId});
    }

    async find(conditions?: FindConditions<Journal>): Promise<Journal[]> {
        conditions = {...conditions, branchId: this.state.branchId};

        return this.repository.find(conditions);
    }

    async findMaxNumber(): Promise<number> {
        const result = await this.repository.createQueryBuilder('journal')
            .select('MAX(journal.number) as "maxNumber"')
            .where({branchId: this.state.branchId, fiscalPeriodId: this.state.fiscalPeriodId})
            .getRawOne();

        return result.maxNumber;
    }

    async save(entity: Journal, state: EntityState): Promise<void> {
        if (state === EntityState.CREATED)
            entity.fiscalPeriod = this.state.fiscalPeriodId;

        super.setCreation(entity, state);

        await this.repository.save(entity)
    }

    @Transaction()
    async transactionalSave(
        entities: ITransactionalEntity[],
        @TransactionRepository(Journal) repo?: Repository<Journal>) {

        const newEntities = entities.filter(item => item.state === EntityState.CREATED).map(item => item.entity),
            editedEntities = entities.filter(item => item.state === EntityState.MODIFIED).map(item => item.entity),
            removedEntities = entities.filter(item => item.state === EntityState.REMOVED).map(item => item.entity);

        newEntities.forEach(e => super.setCreation(e, EntityState.CREATED));

        await repo.save(newEntities);
        await repo.save(editedEntities);
        await repo.remove(removedEntities);
    }

    async remove(entity: Journal): Promise<void> {
        await this.repository.remove(entity)
    }
}

export interface ITransactionalEntity {
    entity: Journal;
    state: EntityState;
}