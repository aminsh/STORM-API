import { Module } from "../Infrastructure/ModuleFramework";
import { Kavenegar } from "./SMS/Kavenegar/Kavenegar";

@Module({
    providers: [Kavenegar]
})
export class IntegrationModule {
}