import { Injectable } from "../DependencyInjection";
import { getCurrentContext } from "../ApplicationCycle";
import { eventEmitter } from "./eventEmitter";

@Injectable()
export class EventPublisher {
    publish(e: any): void {
        let context = getCurrentContext();

        eventEmitter.emit(e.constructor.name, context, e);
    }
}
