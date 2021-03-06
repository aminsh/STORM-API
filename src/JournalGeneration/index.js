import { JournalSaleGenerationService } from "./JournalSaleGenerationService";
import { JournalSaleEventListener } from "./JournalSaleEventListener";
import { JournalPurchaseEventListener } from "./JournalPurchaseEventListener";

export function register(container) {

    container.bind("JournalSaleGenerationService").to(JournalSaleGenerationService);
    container.bind("JournalSaleEventListener").to(JournalSaleEventListener);

    container.bind("JournalPurchaseEventListener").to(JournalPurchaseEventListener);
}