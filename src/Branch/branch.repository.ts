import {DeepPartial, FindConditions, getRepository, Repository} from "typeorm";
import {getUnitOfWork} from "../Infrastructure/ApplicationCycle";
import {Injectable} from "@nestjs/common";
import {Branch} from "./branch.entity";

@Injectable()
export class  BranchRepository {
    protected readonly repository: Repository<Branch>;

    constructor() {
        this.repository = getRepository(Branch);
    }

    async findById(id: string): Promise<Branch | undefined> {
        return this.repository.findOne({id});
    }

    async find(conditions?: FindConditions<Branch>): Promise<Branch[]> {
        return this.repository.find(conditions);
    }

    async findOne(conditions?: FindConditions<Branch>): Promise<Branch | undefined> {
        return this.repository.findOne(conditions);
    }

    async save(entity: DeepPartial<Branch>): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            return await getUnitOfWork().attach(entity);

        await this.repository.save(entity);
    }

    async remove(entity: Branch): Promise<void> {
        const unitOfWork = getUnitOfWork();

        if (unitOfWork)
            await getUnitOfWork().attach(entity, true);

        await this.repository.remove(entity);
    }
}