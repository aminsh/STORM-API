import {UserRepository} from "./UserRepository";
import {UserOauthProfileRepository} from "./UserOauthProfileRepository";
import {ShouldAuthenticatedMiddleware, TokenIsValid} from "./ShouldAuthenticatedMiddleware";
import {ShouldBeStormUserMiddleware} from "./ShouldBeStormUserMiddleware";
import {UserService} from "./UserService";
import {UserQuery} from "./UserQuery";

import "./UserController";

export function register(container) {

    container.bind("UserRepository").to(UserRepository);
    container.bind("UserOauthProfileRepository").to(UserOauthProfileRepository);
    container.bind("ShouldAuthenticated").to(ShouldAuthenticatedMiddleware);
    container.bind("TokenIsValid").to(TokenIsValid);
    container.bind("UserService").to(UserService);
    container.bind("UserQuery").to(UserQuery);

    container.bind("ShouldBeStormUser").to(ShouldBeStormUserMiddleware);
}
