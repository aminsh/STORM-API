import { InvoiceRepository } from "./InvoiceRepository";
import { InvoiceCompareService } from "./InvoiceCompareService";
import { InvoiceTypeRepository } from "./InvoiceTypeRepository";
import { InvoiceTypeService } from "./InvoiceTypeService";
import { InvoiceTypeQuery } from "./InvoiceTypeQuery";

export function register(container) {
    container.bind("InvoiceRepository").to(InvoiceRepository);
    container.bind("InvoiceTypeRepository").to(InvoiceTypeRepository);
    container.bind("InvoiceTypeService").to(InvoiceTypeService);
    container.bind("InvoiceTypeQuery").to(InvoiceTypeQuery);
    container.bind("InvoiceCompareService").to(InvoiceCompareService).inSingletonScope();
}