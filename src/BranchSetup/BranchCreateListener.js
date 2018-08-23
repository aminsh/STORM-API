import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class BranchCreateListener {

    @inject("SetupBranch")
    /**@type{SetupBranch}*/ setup = undefined;

    @EventHandler("BranchCreated")
    onBranchCreated(branchId){

        this.setup.register(branchId);
    }
}