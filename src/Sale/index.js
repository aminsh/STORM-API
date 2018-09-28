import {SaleQuery} from "./SaleQuery";
import {SaleService} from "./SaleService";
import {ReturnSaleQuery} from "./ReturnSaleQuery";
import {ReturnSaleService} from "./ReturnSaleService";

import "./SaleController";
import "./ReturnSaleController";
import "./SendSaleController";
import "./PaymentSaleController";

export function register(container) {

    container.bind("SaleQuery").to(SaleQuery);
    container.bind("SaleService").to(SaleService);

    container.bind("ReturnSaleQuery").to(ReturnSaleQuery);
    container.bind("ReturnSaleService").to(ReturnSaleService);
}