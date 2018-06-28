import {container} from "../di.config";

import {DbContext} from "./DbContext";

container.bind("DefaultKnex").toConstantValue(instanceOf("knex"));
container.bind("DbContext").to(DbContext).inSingletonScope();