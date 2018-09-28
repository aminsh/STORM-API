import {inject, injectable} from "inversify";
import {async} from "../Infrastructure/@decorators";

@injectable()
export class ShouldHaveBranchForGuestUserMiddleware  {

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("UserRepository")
    /** @type {UserRepository}*/ userRepository = undefined;

    @inject("BranchValidateService")
    /** @type {BranchValidateService}*/ branchValidateService = undefined;

    @inject("FiscalPeriodMiddlewareSelector")
    /** @type {FiscalPeriodMiddlewareSelector}*/ fiscalPeriodMiddlewareSelector = undefined;

    @async()
    handler(req, res, next) {

        const ForbiddenResponseAction = () => res.sendStatus(403);

        const branchId = req.query.branchId;

        if(!branchId)
            return  ForbiddenResponseAction();

        const branch = this.branchRepository.findById(branchId);

        if(!branch)
            return ForbiddenResponseAction();

        req.user = {};
        req.branchId = branchId;

        this.fiscalPeriodMiddlewareSelector.handle(req);

        next();
    }
}