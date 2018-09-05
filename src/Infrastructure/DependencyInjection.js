import {Container} from "inversify";

const container = new Container({defaultScope: "Request"});

import {EventBus} from "./EventBus";
import {HttpRequest} from "./HttpRequest";

container.bind("EventBus").to(EventBus);
container.bind("HttpRequest").to(HttpRequest);

export default container;