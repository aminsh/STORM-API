import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";
import {Scale} from "./scale.entity";
import {Injectable} from "../Infrastructure/DependencyInjection";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class ScaleRepository extends RepositoryBase<Scale> {
    protected readonly repository: Repository<Scale> = getRepository(Scale);
}