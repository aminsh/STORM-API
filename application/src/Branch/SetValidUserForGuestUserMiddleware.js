import {inject, injectable} from "inversify";
import {async} from "../core/@decorators";

@injectable()
export class SetValidUserForGuestUserMiddleware  {

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

        const userId = 'STORM-API-USER',

            user = this.userRepository.findById(userId);

        req.user = user;

        next();
    }
}