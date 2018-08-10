import {PurchaseQuery} from "./PurchaseQuery";
import {PurchaseService} from "./PurchaseService";


import "./PurchaseController";

export function register(container) {

    container.bind("PurchaseQuery").to(PurchaseQuery);
    container.bind("PurchaseService").to(PurchaseService);
}