import {Constructor} from "../ExpressFramework/Types";
import {decorate, injectable, Container} from "inversify";
import {BindingInWhenOnSyntax} from "inversify/dts/syntax/binding_in_when_on_syntax";

export const container = new Container({defaultScope: "Request"});

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

function resolveLifecycle(bindingContext: BindingInWhenOnSyntax<any>, lifecycle?: Lifecycle) {

    if (lifecycle === Lifecycle.REQUEST)
        return bindingContext.inRequestScope();
    if (lifecycle === Lifecycle.SINGLETON)
        return bindingContext.inSingletonScope();
    if (lifecycle === Lifecycle.TRANSIENT)
        return bindingContext.inTransientScope();
}

/*export function register() {
    dependencies.forEach(dep => {
        const bidingContext: any = container.bind(dep.name).toConstructor(dep.target);

        if (dep.lifecycle)
            resolveLifecycle(bidingContext, dep.lifecycle);
    });
}*/

export function registerProvider(target: any) {
    //decorate(injectable(), target);
    const binding = container.bind(target).toSelf(),
        dep = dependencies.filter(item => item.name === target.name)[0];

    if(dep.lifecycle === Lifecycle.SINGLETON)
        binding.inSingletonScope();

}

export function registerController(target: any) {
    //decorate(injectable(), target);
    container.bind(target.name).to(target);
}

export enum Lifecycle {
    REQUEST, TRANSIENT, SINGLETON
}

interface IInjectable {
    name: string;
    target: Constructor,
    lifecycle?: Lifecycle
}