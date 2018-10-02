import {inject, injectable} from "inversify";
import {async} from "../Infrastructure/@decorators";

@injectable()
export class ShouldBeStormUserMiddleware  {

    @inject("UserRepository")
    /** @type {UserRepository}*/ userRepository = undefined;

    @async()
    handler(req, res, next) {

        let NoAuthorizedResponseAction = () => res.sendStatus(401),

            userToken = req.headers["authorization"];

        if (!userToken)
            return NoAuthorizedResponseAction();

        let user = this.userRepository.findOne({token: userToken, state: 'active'});

        if (!user)
            return NoAuthorizedResponseAction();

        if(user.role !== 'admin')
            return NoAuthorizedResponseAction();

        req.user = user;

        next();
    }
}
