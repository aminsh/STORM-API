import {PurchaseQuery} from "./PurchaseQuery";
import {PurchaseService} from "./PurchaseService";
import {ReturnPurchaseQuery} from "./ReturnPurchaseQuery";
import {ReturnPurchaseService} from "./ReturnPurchaseService";

import "./PurchaseController";
import "./ReturnPurchaseController";

export function register(container) {

    container.bind("PurchaseQuery").to(PurchaseQuery);
    container.bind("PurchaseService").to(PurchaseService);

    container.bind("ReturnPurchaseQuery").to(ReturnPurchaseQuery);
    container.bind("ReturnPurchaseService").to(ReturnPurchaseService);
}