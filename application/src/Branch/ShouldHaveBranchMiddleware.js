import {inject, injectable} from "inversify";
import {async} from "../core/@decorators";

const knex = instanceOf('knex');

@injectable()
export class ShouldHaveBranchMiddleware  {

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("UserRepository")
    /** @type {UserRepository}*/ userRepository = undefined;

    @inject("BranchValidateService")
    /** @type {BranchValidateService}*/ branchValidateService = undefined;

    @async()
    handler(req, res, next) {

        let noTokenProvidedMessage = 'No token provided.',
            ForbiddenResponseAction = (message = noTokenProvidedMessage) => res.status(403).send(message),

            token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token)
            return ForbiddenResponseAction();

        let member = this.branchRepository.findMemberByToken(token);

        if (!member)
            return ForbiddenResponseAction();

        let result = this.branchValidateService.validate(member.branchId, req.apiCaller, req.originalUrl);

        if(!result.canExecute)
            return ForbiddenResponseAction(result.message);

        req.user = this.userRepository.findOne({id: member.userId});
        req.branchId = member.branchId;

        next();
    }
}