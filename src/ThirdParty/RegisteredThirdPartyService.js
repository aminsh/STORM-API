import {injectable, inject} from "inversify";

@injectable()
export class RegisteredThirdPartyService {

    @inject("RegisteredThirdPartyRepository")
    /** @type {RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;


    @inject("Factory<ThirdParty>")
    thirdPartyFactory = undefined;

    create(key, data, noRegister = false) {

        if (!noRegister) {
            let thirdPartyService = this.thirdPartyFactory(key);

            thirdPartyService.register(data);
        }

        let entity = {key, data};

        this.registeredThirdPartyRepository.create(entity);
    }

    remove(key) {
        this.registeredThirdPartyRepository.remove(key);
    }
}