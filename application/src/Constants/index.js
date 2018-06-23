import {container} from "../di.config";

container.bind("Enums").toConstantValue(instanceOf("Enums"));

import "./ConstantsController";