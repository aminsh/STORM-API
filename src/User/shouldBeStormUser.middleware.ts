import { Injectable } from "../Infrastructure/DependencyInjection";
import { Middleware, NextFunction, Request, Response } from "../Infrastructure/ExpressFramework/Types";
import { UserRepository } from "./user.repository";
import { UnauthorizedException } from "../Infrastructure/Exceptions";
import { UserState } from "./user.entity";


@Injectable()
export class ShouldBeStormUserMiddleware implements Middleware {
    constructor(private readonly userRepository: UserRepository) { }

    async handler(req: Request, res: Response, next: NextFunction): void | Promise<void> {
        const token = req.headers[ 'authorization' ];

        if (!token)
            throw  new UnauthorizedException();

        const user = await this.userRepository.findOne({ token, state: UserState.ACTIVE });

        if (!user)
            throw  new UnauthorizedException();

        if (user.role !== 'admin')
            throw  new UnauthorizedException();

        req.currentContext.user = user;

        next();
    }

}