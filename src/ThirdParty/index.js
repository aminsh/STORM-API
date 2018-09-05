import {RegisteredThirdPartyRepository} from "./RegisteredThirdPartyRepository";
import {RegisteredThirdPartyService} from "./RegisteredThirdPartyService";
import {ThirdPartyQuery} from "./ThirdPartyQuery";

import "./ThirdPartyController";

export function register(container) {

    container.bind("RegisteredThirdPartyRepository").to(RegisteredThirdPartyRepository).inRequestScope();
    container.bind("RegisteredThirdPartyService").to(RegisteredThirdPartyService).inRequestScope();
    container.bind("ThirdPartyQuery").to(ThirdPartyQuery).inRequestScope();
}
