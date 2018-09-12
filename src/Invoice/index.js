import {InvoiceRepository} from "./InvoiceRepository";
import {InvoiceCompareService} from "./InvoiceCompareService";

export function register(container) {

    container.bind("InvoiceRepository").to(InvoiceRepository);
    container.bind("InvoiceCompareService").to(InvoiceCompareService).inSingletonScope();
}