import toAsync from "asyncawait/async";
import container from "./DependencyInjection";

export function eventHandler(eventName) {
    return function (target, key) {

        EventEmitter.on(eventName, toAsync(function () {

            let childContainer = container.createChild(),
                state = arguments[0],
                restOfArguments = Array.from(arguments).asEnumerable().skip(1).toArray();

            childContainer.bind("State").toConstantValue(state);

            let instance = childContainer.get(target.constructor.name);

            instance[key](...restOfArguments);
        }));
    }
}

export function async() {
    return function (target, key, descriptor) {
        descriptor.value = toAsync(descriptor.value);
    }
}

export function log() {
    return function (target, key, descriptor) {
        let func = descriptor.value;

        descriptor.value = function () {

            console.log(arguments);

            let result = func.apply(this, arguments);

            console.log(result);

            return result;
        }
    }
}