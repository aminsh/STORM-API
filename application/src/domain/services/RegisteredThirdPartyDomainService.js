import {injectable, inject} from "inversify";

@injectable()
export class RegisteredThirdPartyDomainService {

    @inject("RegisteredThirdPartyRepository")
    /** @type {RegisteredThirdPartyRepository}*/ registeredThirdPartyDomainService = undefined;


    @inject("Factory<ThirdParty>")
    thirdPartyFactory = undefined;

    create(key, data) {

        let thirdPartyService = this.thirdPartyFactory(key);

        thirdPartyService.register(data);

        let entity = {key, data};

        this.registeredThirdPartyDomainService.create(entity);
    }

    remove(key) {
        this.registeredThirdPartyDomainService.remove(key);
    }


}