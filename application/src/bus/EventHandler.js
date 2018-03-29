import {inject, injectable} from "inversify";
import eventConfigs from "../config/events.json";
import * as Queries from "../../../queries";

@injectable()
export class UserEventHandler {

    /**@type {SettingsDomainService}*/
    @inject("SettingsDomainService") settingsDomainService = undefined;

    /**@type {IState}*/
    @inject("State") state = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    getHandler(eventName){
        let eventConfig = eventConfigs.asEnumerable().singleOrDefault(e => e.method === eventName);

        if (!eventConfig)
            throw new Error("Event not found");

        let event = this.settingsDomainService.getEvent(eventConfig.module, eventConfig.event);

        if (event && event.handler && typeof eval(`(${event.handler})`) === 'function')
            return event;
    }

    run(eventName, params) {
        let self = this,
            parameters = Array.isArray(params) ? params : [params],
            settings = new Queries.SettingsQuery(this.state.branchId),
            event = this.getHandler(eventName),

            func = eval(`(${event.handler})`);

        func.apply({runService, query, settings}, parameters);

        function runService(serviceName, params) {
            return self.commandBus.send(serviceName, params);
        }

        function query(queryName) {
            return new Queries[queryName](self.state.branchId);
        }
    }
}