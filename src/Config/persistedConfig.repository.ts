import { EntityRepository, Repository } from "typeorm";
import { PersistedConfig } from "./persistedConfig.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";

@Injectable()
@EntityRepository(PersistedConfig)
export class PersistedConfigRepository extends Repository<PersistedConfig> {
}