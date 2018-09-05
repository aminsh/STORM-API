import {inject, injectable} from "inversify";

@injectable()
export class EventBus {

    /**@type {IState}*/
    @inject("State") state = undefined;

    /**
     * @param {string} eventName
     * @param args
     */
    send(eventName, ...args) {
        EventEmitter.emit(eventName, this.state, ...args);
    }
}