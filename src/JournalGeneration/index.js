import {JournalSaleGenerationService} from "./JournalSaleGenerationService";
import {JournalSaleEventListener} from "./JournalSaleEventListener";

export function register(container) {

    container.bind("JournalSaleGenerationService").to(JournalSaleGenerationService);
    container.bind("JournalSaleEventListener").to(JournalSaleEventListener);
}