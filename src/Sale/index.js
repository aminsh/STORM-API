import { SaleQuery } from "./SaleQuery";
import { SaleService } from "./SaleService";
import { ReturnSaleQuery } from "./ReturnSaleQuery";
import { ReturnSaleService } from "./ReturnSaleService";
import { SaleJournalEventListener } from "./SaleJournalEventListener";

import "./SaleController";
import "./ReturnSaleController";
import "./SendSaleController";
import "./PaymentSaleController";
import "./SaleTypeController";


export function register(container) {

    container.bind("SaleQuery").to(SaleQuery);
    container.bind("SaleService").to(SaleService);

    container.bind("ReturnSaleQuery").to(ReturnSaleQuery);
    container.bind("ReturnSaleService").to(ReturnSaleService);

    container.bind("SaleJournalEventListener").to(SaleJournalEventListener);
}