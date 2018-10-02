import {inject} from "inversify";
import {Controller, Post, WithoutControlPermissions} from "../Infrastructure/expressUtlis";

@Controller("/v1/setup", "ShouldBeStormUser")
@WithoutControlPermissions()
class SetupBranchController {

    @inject("SetupBranch")
    /**@type{SetupBranch}*/ setupBranch = undefined;

    @Post("/:branchId/refresh-chart-of-accounts")
    refresh(req) {

        this.setupBranch.chartOfAccounts(req.params.branchId);
    }
}