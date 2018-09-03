import {SaleQuery} from "./SaleQuery";
import {SaleService} from "./SaleService";

import "./SaleController";
import "./SendSaleController";
import "./PaymentSaleController";

export function register(container) {

    container.bind("SaleQuery").to(SaleQuery);
    container.bind("SaleService").to(SaleService);
}