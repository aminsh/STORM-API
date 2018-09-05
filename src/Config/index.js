import {PersistedConfigService} from "./PersistedConfigService";

export function register(container) {

    container.bind("PersistedConfigService").to(PersistedConfigService).inSingletonScope();
}