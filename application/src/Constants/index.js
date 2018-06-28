import "./ConstantsController";

export function register(container) {

    container.bind("Enums").toConstantValue(instanceOf("Enums"));
}