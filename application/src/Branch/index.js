import {container} from "../di.config";

import {BranchRepository} from "./BranchRepository";
import {BranchEventListener} from "./BranchEventListener";
import {BranchValidateService} from "./BranchValidateService";
import {BranchSubscriptionRepository} from "./BranchSubscriptionRepository";

container.bind("BranchRepository").to(BranchRepository).inSingletonScope();
container.bind("BranchEventListener").to(BranchEventListener).inSingletonScope();
container.bind("BranchValidateService").to(BranchValidateService).inSingletonScope();
container.bind("BranchSubscriptionRepository").to(BranchSubscriptionRepository).inSingletonScope();