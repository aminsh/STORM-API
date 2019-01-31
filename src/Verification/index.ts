import { Module } from "../Infrastructure/ModuleFramework";
import { VerificationRepository } from "./verification.repository";
import { VerificationService } from "./verification.service";

@Module({
    providers: [ VerificationRepository, VerificationService ]
})
class VerificationModule {
}