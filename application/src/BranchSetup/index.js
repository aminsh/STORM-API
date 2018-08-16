import {SetupBranch} from "./SetupBranch";
import {BranchCreateListener} from "./BranchCreateListener";

export function register(container) {

    container.bind("SetupBranch").to(SetupBranch);
    container.bind("BranchCreateListener").to(BranchCreateListener);
}