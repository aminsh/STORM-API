import {inject, injectable} from "inversify"
import serviceConfig from "../config/config.services.json";


@injectable()
export class CommandBus {

    @inject("Factory<DomainService>")
    factory = undefined;

    @inject("State")
    state = undefined;

    send(serviceName, command) {

        const serviceId = Utility.Guid.new(),
            service = serviceConfig.asEnumerable().single(service => service.name === serviceName),
            state = this.state;

        EventEmitter.emit('onServiceStarted', serviceId, {command, state, service: serviceName});

        try {

            let instance = this.factory(service.class),
                result = instance[service.method](...command);

            EventEmitter.emit('onServiceSucceed', serviceId, result);

            return result;
        }
        catch (e) {
            console.log(e);

            if (e instanceof ValidationException) {
                EventEmitter.emit('onServiceInvalid', serviceId, e);

                throw new ValidationException(e.errors);
            }
            else {
                EventEmitter.emit('onServiceFailed', serviceId, e);
                throw new ValidationException(['internal error']);
            }
        }
    }

}