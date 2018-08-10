import {inject, injectable} from "inversify";
import {container} from "../di.config";
import async from "asyncawait/async";

/*EventEmitter.on("EventHandler", async(function (state, eventName, parameters) {
     let childContainer = container.createChild();

    childContainer.bind("State").toConstantValue(state);

    childContainer.get("EventHandler").handle(eventName, parameters);
}));*/

@injectable()
export class EventBus {

    /**@type {IState}*/
    @inject("State") state = undefined;

    /**
     * @param {string} eventName
     */
    send(eventName, ...args) {
        EventEmitter.emit(eventName, this.state, ...args);
    }
}