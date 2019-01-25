import {DeepPartial, FindConditions, getRepository, Repository} from "typeorm";
import {getUnitOfWork} from "../Infrastructure/ApplicationCycle";
import {Injectable} from "../Infrastructure/DependencyInjection";
import {BranchMember} from "./branchMember.entity";

@Injectable()
export class  BranchMemberRepository {
    protected readonly repository: Repository<BranchMember>;

    constructor() {
        this.repository = getRepository(BranchMember);
    }

    async findById(id: number): Promise<BranchMember | undefined> {
        return this.repository.findOne({id});
    }

    async find(conditions?: FindConditions<BranchMember>): Promise<BranchMember[]> {
        return this.repository.find(conditions);
    }

    async findOne(conditions?: FindConditions<BranchMember>): Promise<BranchMember | undefined> {
        return this.repository.findOne(conditions);
    }

    async save(entity: DeepPartial<BranchMember>): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            return await getUnitOfWork().attach(entity);

        await this.repository.save(entity);
    }

    async remove(entity: BranchMember): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            await getUnitOfWork().attach(entity, true);

        await this.repository.remove(entity);
    }
}