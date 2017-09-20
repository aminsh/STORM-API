"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Promise = require('promise'),
    Guid = instanceOf('utility').Guid,
    DomainException = instanceOf('domainException');

class WorkflowBase {

    constructor(state, data) {
        this.steps = [];

        this.id = Guid.new();
        this.state = state;
        this.data = data;
    }

    startWith(Step) {
        return this.then(Step);
    }

    then(Step) {
        this.steps.push(Step);
        return this;
    }

    onError(cb) {
        this.errorHandler = cb;
        return this;
    }

    handle(step) {

        let Handler = step.handler,
            data, instance;

        if (step.canExecute) {
            const canExecute = async(step.canExecute)(this.data);
            if (!canExecute) return;
        }

        if (step.input)
            data = step.input(this.data);

        if (Handler.prototype) {
            instance = new Handler(this.state, data);

            await(instance.run());
        }
        else {
            instance = {result: Handler(this.state, data)};
        }


        if (step.output)
            this.data = step.output(this.data, instance.result);

    }

    build() {
    }

    start() {
        try {
            this.steps.forEach(async.result(step => await(this.handle(step))));
        }
        catch (e) {

            const error = e instanceof DomainException ? e.errors : e;

            this.errorHandler && this.errorHandler(error);
        }
    }
}

module.exports = WorkflowBase;

