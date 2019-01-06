import {Injectable} from "../../Infrastructure/DependencyInjection";
import {RepositoryBase} from "../../Infrastructure/Domain/RepositoryBase";
import {Journal} from "./Journal";

@Injectable()
export class JournalRepository extends RepositoryBase<Journal> {
    constructor() {
        super(Journal);
    }

    async findMaxNumber(): Promise<number> {
        const result = await this.repository.createQueryBuilder('journal')
            .select('MAX(journal.number) as "maxNumber"')
            .where({branchId: this.currentContext.branchId, fiscalPeriodId: this.currentContext.fiscalPeriodId})
            .getRawOne();

        return result.maxNumber;
    }
}
