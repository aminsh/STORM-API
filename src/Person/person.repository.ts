import { Injectable } from "../Infrastructure/DependencyInjection";
import { RepositoryBase } from "../Infrastructure/Domain/RepositoryBase";
import { Person } from "./person.entity";
import { getRepository, Repository } from "typeorm";
import { getCurrentContext } from "../Infrastructure/ApplicationCycle";

@Injectable()
export class PersonRepository extends RepositoryBase<Person> {
    protected readonly repository: Repository<Person> = getRepository(Person);

    async getCode(): Promise<number> {
        const context = getCurrentContext();

        const result: { maxCode: number } = await this.repository.createQueryBuilder('person')
            .select('MAX(person.code) as "maxCode"')
            .where({branchId: context.branchId})
            .getRawOne();

        return (result.maxCode || 1000) + 1;
    }
}