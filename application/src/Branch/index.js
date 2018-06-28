import {BranchRepository} from "./BranchRepository";
import {BranchEventListener} from "./BranchEventListener";
import {BranchValidateService} from "./BranchValidateService";
import {BranchSubscriptionRepository} from "./BranchSubscriptionRepository";
import {BranchQuery} from "./BranchQuery";
import {BranchService} from "./BranchService";
import {ShouldHaveBranchMiddleware} from "./ShouldHaveBranchMiddleware";

import "./BranchController";

export function register(container) {

    container.bind("BranchRepository").to(BranchRepository);
    container.bind("BranchEventListener").to(BranchEventListener);
    container.bind("BranchValidateService").to(BranchValidateService);
    container.bind("BranchSubscriptionRepository").to(BranchSubscriptionRepository);
    container.bind("BranchQuery").to(BranchQuery);
    container.bind("BranchService").to(BranchService);
    container.bind("ShouldHaveBranch").to(ShouldHaveBranchMiddleware);
}