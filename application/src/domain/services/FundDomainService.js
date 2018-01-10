import {inject, injectable} from "inversify";

@injectable()
export class FundDomainService {

    /** @type {DetailAccountDomainService}*/
    @inject("DetailAccountDomainService") detailAccountDomainService = undefined;

    create(cmd){
        cmd.detailAccountType = 'fund';

        return this.detailAccountDomainService.create(cmd);
    }

    update(id , cmd){
        this.detailAccountDomainService.update(id, cmd);
    }

    remove(id){

        this.detailAccountDomainService.remove(id);
    }
}
