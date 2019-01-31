import { Module } from "../Infrastructure/ModuleFramework";
import { SMSService } from "./SMS.service";

@Module({
    providers: [SMSService]
})
export class NotificationModule {
}