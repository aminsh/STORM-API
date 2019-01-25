import { Middleware, Request, Response, NextFunction } from "../Infrastructure/ExpressFramework/Types";
import { BranchMemberRepository } from "./branchMember.repository";
import { ForbiddenException } from "../Infrastructure/Exceptions";
import { Injectable } from "../Infrastructure/DependencyInjection";

@Injectable()
export class ShouldHaveBranchMiddleware implements Middleware {
    constructor(private readonly branchMemberRepository: BranchMemberRepository) {
    }

    async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.body.token || req.query.token || req.headers[ 'x-access-token' ];
        let member = await this.branchMemberRepository.findOne({ token });

        if (!member)
            throw new ForbiddenException('No Token provided');

        req.currentContext.branchId = member.branch.id;
        req.currentContext.user = member.user;

        next();
    }
}