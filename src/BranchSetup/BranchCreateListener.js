import {injectable, inject} from "inversify";
import {eventHandler} from "../Infrastructure/@decorators";

@injectable()
export class BranchCreateListener {

    @inject("SetupBranch")
    /**@type{SetupBranch}*/ setup = undefined;

    @eventHandler("BranchCreated")
    onBranchCreated(branchId){

        this.setup.register(branchId);
    }
}