import {inject, injectable} from "inversify";
import {async} from "../Infrastructure/@decorators";

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

            user = this.userRepository.findOne({id: userId});

        req.user = user;

        next();
    }
}