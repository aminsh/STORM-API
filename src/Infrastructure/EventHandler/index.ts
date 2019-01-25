import {eventEmitter} from "./eventEmitter";
import { container } from "../DependencyInjection";
import { Context } from "../ExpressFramework/Types";
import * as cls from 'cls-hooked';
import { RequestContextImpl } from "../ApplicationCycle";
import {Request} from "../ExpressFramework/Types";

export * from './EventPublisher';

export function EventListener(EventListener) {
    return function (target, key) {
        eventEmitter.on(target.constructor.name, async function (context: Context, e: any) {
           let childContainer = container.createChild();

            const sessionName = 'STORM-SESSION';
            const session = cls.createNamespace(sessionName);

            let request = {currentContext: context} as Request;

            session.run(async () => {
                session.set('CURRENT-CONTEXT', new RequestContextImpl(request));

                childContainer.get(EventListener)[key](e);
            });
        });
    }
}


