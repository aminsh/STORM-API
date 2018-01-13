import {inject, injectable} from "inversify";
import eventConfigs from "../config/events.json";
import * as Queries from "../../../queries";

@injectable()
export class EventHandler {

    @inject("Factory<EventHandler>") factory = undefined;

    /**@type {SettingsDomainService}*/
    @inject("SettingsDomainService") settingsDomainService = undefined;

    /**@type {IState}*/
    @inject("State") state = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    handle(eventName, parameters) {
        let eventConfig = eventConfigs.asEnumerable().singleOrDefault(e => e.method === eventName),
            params = Array.isArray(parameters) ? parameters : [parameters];

        if (!eventConfig)
            throw new Error("Event not found");

        let event = this.settingsDomainService.getEvent(eventConfig.module, eventConfig.event);

        if (event && event.handler && typeof eval(`(${event.handler})`) === 'function')
            return this.runUserEventHandler(event.handler, parameters);

        let instance = this.factory(eventConfig.class);

            instance[eventConfig.method](...params);
    }

    runUserEventHandler(handler, params) {
        let self = this,
            parameters = Array.isArray(params) ? params : [params],
            settings = new Queries.SettingsQuery(this.state.branchId),

            func = eval(`(${event.handler})`);

        func.apply({runService, query, settings}, parameters);

        function runService(serviceName, params) {
            return self.commandBus.send(serviceName, ...params);
        }

        function query(queryName) {
            return new Queries[queryName](self.state.branchId);
        }
    }
}