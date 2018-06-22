import {container} from "../di.config";

import {UserRepository} from "./UserRepository";
import {ShouldAuthenticatedMiddleware, TokenIsValid} from "./ShouldAuthenticatedMiddleware";
import {UserService} from "./UserService";
import {UserQuery} from "./UserQuery";

container.bind("UserRepository").to(UserRepository);
container.bind("ShouldAuthenticated").to(ShouldAuthenticatedMiddleware);
container.bind("TokenIsValid").to(TokenIsValid);
container.bind("UserService").to(UserService);
container.bind("UserQuery").to(UserQuery);

import "./UserController";
