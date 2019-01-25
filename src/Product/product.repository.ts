import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";
import {Product} from "./product.entity";
import {Injectable} from "../Infrastructure/DependencyInjection";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class ProductRepository extends RepositoryBase<Product> {
    protected readonly repository: Repository<Product> = getRepository(Product);
}
