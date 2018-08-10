import {SaleQuery} from "./SaleQuery";
import {SaleService} from "./SaleService";

import "./SaleController";

export function register(container) {

    container.bind("SaleQuery").to(SaleQuery);
    container.bind("SaleService").to(SaleService);
}