import { Configuration } from "./Configuration";
import { PersistedConfigRepository } from "./persistedConfig.repository";
import { Module } from "../Infrastructure/ModuleFramework";

@Module({
    providers: [ PersistedConfigRepository, Configuration ]
})
export class ConfigModule {
}
