import {inject, injectable} from "inversify";

@injectable()
export class BanksNameService {

    /**@type {BanksNameRepository}*/
    @inject("BanksNameRepository") banksNameRepository = undefined;

    create(cmd) {
        let bankName = this.banksNameRepository.findByName(cmd.title);

        if(bankName)
            return bankName.id;

        return this.banksNameRepository.create(cmd);
    }
}

