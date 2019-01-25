import { RepositoryBase } from "../../Infrastructure/Domain/RepositoryBase";
import { Dimension } from "./dimension.entity";
import { Repository, getRepository } from "typeorm";
import { Injectable } from "../../Infrastructure/DependencyInjection";

@Injectable()
export class DimensionRepository extends RepositoryBase<Dimension> {
    protected repository: Repository<Dimension> = getRepository(Dimension);
}