import {Container} from "inversify";

const container = new Container({defaultScope: "Request"});

import {EventBus} from "./EventBus";

container.bind("EventBus").to(EventBus);

export default container;