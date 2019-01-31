import { Middleware, Request, Response, NextFunction } from "../Infrastructure/ExpressFramework/Types";
import { BranchMemberRepository } from "./branchMember.repository";
import { ForbiddenException } from "../Infrastructure/Exceptions";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { BranchValidateService } from "./branchValidate.service";
import { FiscalPeriodSelectorService } from "src/FiscalPeriod/fiscalPeriod.selector.service";

@Injectable()
export class ShouldHaveBranchMiddleware implements Middleware {
    constructor(private readonly branchMemberRepository: BranchMemberRepository,
                private readonly branchValidateService: BranchValidateService,
                private readonly fiscalPeriodSelectorService: FiscalPeriodSelectorService) { }

    async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        let member = await this.branchMemberRepository.findOne({ token });

        if (!member)
            throw new ForbiddenException('No Token provided');

        let result = this.branchValidateService.validate(member.branch, req.apiCaller, req.originalUrl);

        if (!result.canExecute)
            throw new ForbiddenException(result.message);

        req.currentContext.branchId = member.branch.id;
        req.currentContext.user = member.user;

        this.fiscalPeriodSelectorService.handle(req);

        next();
    }
}