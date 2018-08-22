import enums from "./enums";

import "./ConstantsController";

export function register(container) {

    container.bind("Enums").toConstantValue(enums);
}