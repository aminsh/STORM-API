import { Injectable } from "../Infrastructure/DependencyInjection";
import { PersistedConfigRepository } from "./persistedConfig.repository";
import { Enumerable } from "../Infrastructure/Utility";
import { Features } from "./Features";

@Injectable()
export class Configuration {
    ORIGIN_URL: string = process.env.ORIGIN_URL;
    NODE_ENV: string = process.env.NODE_ENV;
    PORT: string = process.env.PORT;
    EMAIL_FROM: string = process.env.EMAIL_FROM;
    EMAIL_HOST: string = process.env.EMAIL_HOST;
    EMAIL_PORT: string = process.env.EMAIL_PORT;
    EMAIL_AUTH_USER: string = process.env.EMAIL_AUTH_USER;
    EMAIL_AUTH_PASSWORD: string = process.env.EMAIL_AUTH_PASSWORD;
    DATABASE_URL: string = process.env.DATABASE_URL;
    DELIVERY_URL: string = process.env.DELIVERY_URL;
    DASHBOARD_URL: string = process.env.DASHBOARD_URL;
    CREDENTIALS_URL: string = process.env.CREDENTIALS_URL;

    STORM_BRANCH_TOKEN: string;
    STORM_BRANCH_ID: string;
    KAVENEGAR_API_KEY: string;
    KAVENEGAR_SENDER: string;

    FEATURES: Features = new Features;

    constructor(private readonly persistedConfigRepository: PersistedConfigRepository) { }

    async ready(): Promise<void> {
        await this.fetch();
    }

    async refresh(): Promise<void> {
        await this.fetch();
    }

    async fetch() {
        const persistedConfigData = await this.persistedConfigRepository.find(),
            persistedConfig: any = Enumerable.from(persistedConfigData).toObject(item => item.key, item => item.value);
        persistedConfig.STORM_BRANCH_TOKEN = this.STORM_BRANCH_TOKEN;
        persistedConfig.STORM_BRANCH_ID = this.STORM_BRANCH_ID;
        persistedConfig.KAVENEGAR_API_KEY = this.KAVENEGAR_API_KEY;
        persistedConfig.KAVENEGAR_SENDER = this.KAVENEGAR_SENDER;
    }
}
