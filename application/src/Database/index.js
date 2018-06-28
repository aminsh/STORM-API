import {DbContext} from "./DbContext";

export function register(container) {

    container.bind("DefaultKnex").toConstantValue(instanceOf("knex"));
    container.bind("DbContext").to(DbContext).inSingletonScope();
}

