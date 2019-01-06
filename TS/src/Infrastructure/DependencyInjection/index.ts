import {Constructor} from "../ExpressFramework/Types";
import {decorate, injectable} from "inversify";
import {BindingInWhenOnSyntax} from "inversify/dts/syntax/binding_in_when_on_syntax";

export {
    inject as Inject,
    postConstruct as PostConstruct
} from "inversify";

export let dependencies: IInjectable[] = [];

export function Injectable(lifecycle?: Lifecycle): Function {

    return function (target: Constructor) {
        dependencies.push({name: target.name, target, lifecycle});

        decorate(injectable(), target);
    }
}

export function resolveLifecycle(bindingContext: BindingInWhenOnSyntax<any>, lifecycle?: Lifecycle) {

    if (lifecycle === Lifecycle.REQUEST)
        return bindingContext.inRequestScope();
    if (lifecycle === Lifecycle.SINGLETON)
        return bindingContext.inSingletonScope();
    if (lifecycle === Lifecycle.TRANSIENT)
        return bindingContext.inTransientScope();
}

export enum Lifecycle {
    REQUEST, TRANSIENT, SINGLETON
}

interface IInjectable {
    name: string;
    target: Constructor,
    lifecycle?: Lifecycle
}