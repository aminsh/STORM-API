import {inject, injectable} from "inversify";
import {BanksNameRepository} from "../data/repository.banksName";

@injectable()
export class BanksNameDomainService {

    /**@type {BanksNameRepository}*/
    @inject("BanksNameRepository") banksNameRepository = undefined;

    create(cmd) {
        let bankName = this.banksNameRepository.findByName(cmd.title);

        if(bankName)
            return bankName.id;

        return this.banksNameRepository.create(cmd);
    }
}

