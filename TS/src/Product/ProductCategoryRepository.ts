import {inject, injectable, postConstruct} from "inversify";
import {ProductCategory} from "./ProductCategory";
import {EntityState} from "../Infrastructure/EntityState";
import * as toResult from "asyncawait/await";
import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";

@injectable()
export class ProductCategoryRepository extends RepositoryBase<ProductCategory> {

    constructor() {
        super(ProductCategory);
    }

    findById(id: string): ProductCategory {
        return toResult(this.repository.findOne({id, branchId: this.state.branchId}));
    }

    save(entity: ProductCategory, state: EntityState): void {

        super.setCreation(entity, state);

        toResult(this.repository.save(entity));
    }

    remove(entity: ProductCategory): void {

        toResult(this.repository.remove(entity));
    }
}