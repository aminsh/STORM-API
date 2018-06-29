import {container} from "../di.config";

import {RegisteredThirdPartyRepository} from "./RegisteredThirdPartyRepository";
import {RegisteredThirdPartyService} from "./RegisteredThirdPartyService";
import {ThirdPartyQuery} from "./ThirdPartyQuery";

container.bind("RegisteredThirdPartyRepository").to(RegisteredThirdPartyRepository).inRequestScope();
container.bind("RegisteredThirdPartyService").to(RegisteredThirdPartyService).inRequestScope();
container.bind("ThirdPartyQuery").to(ThirdPartyQuery).inRequestScope();

import "./ThirdPartyController";