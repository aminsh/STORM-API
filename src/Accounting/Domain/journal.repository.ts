import {Injectable} from "../../Infrastructure/DependencyInjection";
import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Journal} from "./Journal.entity";
import {FindConditions, getRepository, Repository} from "typeorm";
import {getCurrentContext} from "../../Infrastructure/ApplicationCycle";
import {JournalLine} from "./journalLine.entity";
import {Context} from "../../Infrastructure/ExpressFramework/Types";

@Injectable()
export class JournalRepository extends RepositoryBase<Journal> {
    protected readonly repository: Repository<Journal> = getRepository(Journal);
    private readonly journalLineRepository: Repository<JournalLine> = getRepository(JournalLine);
    private readonly currentContext: Context = getCurrentContext();

    async findMaxNumber(): Promise<number> {
        const result: { maxNumber: number } = await this.repository.createQueryBuilder('journal')
            .select('MAX(journal.number) as "maxNumber"')
            .where({branchId: this.currentContext.branchId, fiscalPeriodId: this.currentContext.fiscalPeriodId})
            .getRawOne();

        return (result.maxNumber || 0) + 1;
    }

    async findLines(conditions?: FindConditions<JournalLine>): Promise<JournalLine[]> {
        return this.journalLineRepository.find({...conditions, ...{branchId: this.currentContext.branchId}});
    }
}
