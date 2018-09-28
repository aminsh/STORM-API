import {Container} from "inversify";

const container = new Container({defaultScope: "Request"});

import {EventBus} from "./EventBus";
import {HttpRequest} from "./HttpRequest";
import {JobManager} from "./JobManager";

container.bind("EventBus").to(EventBus);
container.bind("HttpRequest").to(HttpRequest);
container.bind("JobManager").to(JobManager).inSingletonScope();

export default container;