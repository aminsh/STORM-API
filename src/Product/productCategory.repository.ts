import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";
import {ProductCategory} from "./productCategory.entity";
import {Injectable} from "../Infrastructure/DependencyInjection";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class ProductCategoryRepository extends RepositoryBase<ProductCategory> {
      protected readonly repository: Repository<ProductCategory> = getRepository(ProductCategory);
}