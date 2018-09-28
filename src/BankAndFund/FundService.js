import {inject, injectable} from "inversify";

@injectable()
export class FundService {

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    create(cmd){
        cmd.detailAccountType = 'fund';

        return this.detailAccountService.create(cmd);
    }

    update(id , cmd){
        this.detailAccountService.update(id, cmd);
    }

    remove(id){

        this.detailAccountService.remove(id);
    }
}
