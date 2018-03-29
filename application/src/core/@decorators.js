import async from "asyncawait/async";
import {container} from "../di.config";

export function eventHandler(eventName) {
    return function (target, key) {

        EventEmitter.on(eventName, async(function () {

            let childContainer = container.createChild(),
                state = arguments[0],
                restOfArguments = Array.from(arguments).asEnumerable().skip(1).toArray();

            childContainer.bind("State").toConstantValue(state);

            let instance = childContainer.get(target.constructor.name);

            instance[key](...restOfArguments);
        }));
    }
}