import {inject, injectable} from "inversify";
import flatten from "flat";

@injectable()
export class BaseDomainService {

    repository = undefined;
    existentValue = undefined;
    changeSet = [];
    id = undefined;
    propertyHandler = {};
    entity = {};
    events = {};

    /** @type {EventBus}*/
    @inject("EventBus") _eventBus = undefined;

    eventBus = {
        send: (eventName, parameter) => {
            this.events[eventName] = parameter
        }
    };

    constructor() {
        this.propertyHandler = handlers[this.constructor.name];
    }

    get data() {
        let data = {};

        this.changeSet.forEach(key => data[key] = this.entity[key]);

        return data;
    }

    mapper() {
        Object.keys(this.existentValue).forEach(key => this.entity[key] = this.changedValue(key));
    }


    changedValue(propertyName) {
        if (!this.cmd)
            throw new ValidationException('command is undefined!');

        if(typeof this.cmd[propertyName] === 'undefined')
            return this.existentValue[propertyName];

        if (Array.isArray(this.existentValue[propertyName]))
            this.existentValue[propertyName] = JSON.stringify(this.existentValue[propertyName]);

        if (this.cmd[propertyName] !== this.existentValue[propertyName]) {
            this.changeSet.push(propertyName);
            return this.cmd[propertyName];
        }

        return this.existentValue[propertyName];
    }

    execute(id, cmd) {
        this.id = id;
        this.cmd = cmd;

        this.fetch();

        this.changeSet.forEach(item => this.propertyHandler[item] && this[this.propertyHandler[item]]());
    }

    fetch() {
        this.existentValue = this.repository.findById(this.id);

        this.existentValue = flatten(this.existentValue);

        if (!this.existentValue)
            throw new ValidationException(['existent value is undefined!']);

        this.mapper();
    }

    submitEvents() {
        Object.keys(this.events).forEach(key => this._eventBus.send(key, this.events[key]));
    }


}

const handlers = {};

export function whenPropertyChanged(propertyName) {
    return function (target, key) {

        handlers[target.constructor.name] = handlers[target.constructor.name] || {};

        handlers[target.constructor.name][propertyName] = key
    }
}