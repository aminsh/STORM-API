import {injectable} from "inversify";
import {Product} from "./Product";
import {EntityState} from "../Infrastructure/EntityState";
import {FindConditions, getRepository} from "typeorm";
import * as toResult from "asyncawait/await";
import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";
import {Repository} from "../Infrastructure/Providers";

@Repository()
export class ProductRepository extends RepositoryBase<Product> {

    constructor() {
        super(Product);
    }

    findById(id: string): Product {

        return toResult(this.repository.findOne({id, branchId: this.state.branchId}));
    }

    findOne(conditions?: FindConditions<Product>): Product {

        conditions = {...conditions, branchId: this.state.branchId};

        return toResult(this.repository.findOne({order: {accountId: "ASC"}}));
    }

    save(entity: Product, state: EntityState): void {

        this.setCreation(entity, state);

        toResult(this.repository.save(entity));
    }

    remove(entity: Product): void {

        toResult(this.repository.remove(entity))
    }
}