import {InvoiceRepository} from "./InvoiceRepository";

export function register(container) {

    container.bind("InvoiceRepository").to(InvoiceRepository);
}