import { CurrencyQuery } from "./CurrencyQuery";

import './CurrencyController';

export function register(container) {
    container.bind("CurrencyQuery").to(CurrencyQuery);
}