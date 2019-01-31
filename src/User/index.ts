import { Module } from "src/Infrastructure/ModuleFramework";
import { UserRepository } from "./user.repository";
import { ShouldAuthenticatedMiddleware, UserTokenValidateMiddleware } from "./shouldAthenticated.middleware";
import { ShouldBeStormUserMiddleware } from "./shouldBeStormUser.middleware";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    providers: [
        UserRepository,
        ShouldAuthenticatedMiddleware,
        ShouldBeStormUserMiddleware,
        UserTokenValidateMiddleware,
        UserService
    ],
    controllers: [ UserController ]
})
export class UserModule {
}