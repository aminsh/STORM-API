import {ProductView} from "./ProductView";
import {FindConditions, getRepository, Raw} from "typeorm";
import {QueryProvider} from "../Infrastructure/Query/QueryProvider";
import {Service} from "../Infrastructure/Providers";
import {Inject} from "../Infrastructure/DependencyInjection/index";

@Service()
export class ProductQuery {

    private static get repository() {
        return getRepository(ProductView);
    }

    @Inject("State") state: State;

    @Inject("QueryService") queryProvider: QueryProvider<ProductView>;

    async getAll(parameters: Parameters): Promise<Page<ProductView> | ProductView[]> {
        let conditions: FindConditions<ProductView> = {
            branchId: this.state.branchId,
            fiscalPeriodId: Raw(columnAlias => `(${columnAlias} IS NULL OR ${columnAlias} = '${this.state.fiscalPeriodId}') `)
        };

        return (await this.queryProvider.find(ProductView, parameters, conditions)).data;
    }

    async getById(id: string): Promise<ProductView> {

        return ProductQuery.repository.findOne({branchId: this.state.branchId, id});
    }

    async getByCategory(categoryId: string): Promise<ProductView[]> {

        return ProductQuery.repository.createQueryBuilder("product")
            .where({})
            .getMany()
    }
}