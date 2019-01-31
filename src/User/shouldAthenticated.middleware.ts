import { Injectable } from "src/Infrastructure/DependencyInjection";
import { Request, NextFunction, Middleware } from "../Infrastructure/ExpressFramework/Types";
import { UserRepository } from "./user.repository";
import { UnauthorizedException } from "src/Infrastructure/Exceptions";
import { UserState } from "./user.entity";
import { Not } from "typeorm";

@Injectable()
export class ShouldAuthenticatedMiddleware implements Middleware {
    constructor(private readonly userRepository: UserRepository) { }

    async handler(req: Request, res: any, next: NextFunction): Promise<void> {
        const token = req.headers["authorization"];

        if (!token)
            throw new UnauthorizedException();

        let user = await this.userRepository.findOne({ token, state: UserState.ACTIVE });

        if (!user)
            throw new UnauthorizedException();
        
        req.currentContext.user = user;

        next();
    }
}

@Injectable()
export class UserTokenValidateMiddleware implements Middleware {
    constructor(private readonly userRepository: UserRepository) { }

    async handler(req: Request, res: any, next: NextFunction): Promise<void> {
        const token = req.headers["authorization"];

        if (!token)
            throw new UnauthorizedException();

        let user = await this.userRepository.findOne({ token, state: Not(UserState.BLOCKED) });

        if (!user)
            throw new UnauthorizedException();
        
        req.currentContext.user = user;

        next();
    }
}
