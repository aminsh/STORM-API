import {DbContext} from "./DbContext";
import Knex from "knex";

const knex = Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: true
});

export function register(container) {

    container.bind("DefaultKnex").toConstantValue(knex);
    container.bind("DbContext").to(DbContext).inSingletonScope();
}

