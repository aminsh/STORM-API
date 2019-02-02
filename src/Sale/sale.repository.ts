import { RepositoryBase } from "../Infrastructure/Domain/RepositoryBase";
import { Sale } from "./sale.entitty";
import { getRepository, Repository } from "typeorm";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { getCurrentContext } from "../Infrastructure/ApplicationCycle";

@Injectable()
export class SaleRepository extends RepositoryBase<Sale> {
    protected readonly repository: Repository<Sale> = getRepository(Sale);

    async getNumber(): Promise<number> {
        const context = getCurrentContext();

        const result: { maxNumber: number } = await this.repository.createQueryBuilder('sale')
            .select('MAX(sale.number) as "maxNumber"')
            .where({branchId: context.branchId})
            .getRawOne();

        return (result.maxNumber || 0) + 1;
    }
}