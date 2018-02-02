import {inject, injectable} from "inversify"
import serviceConfig from "../config/config.services.json";
import {ApplicationServiceLogger} from "../ApplicationLogger";


@injectable()
export class CommandBus {

    @inject("Factory<DomainService>")
    factory = undefined;

    @inject("State")
    state = undefined;

    /**@type {IUnitOfWork}*/
    @inject("UnitOfWork") unitOfWork = undefined;


    logger = new ApplicationServiceLogger();

    send(serviceName, parameters) {

        const serviceId = Utility.Guid.create(),
            service = serviceConfig.asEnumerable().single(service => service.name === serviceName),
            state = this.state,
            command = {};

        for (let i = 0; i <= service.params.length; i++) {
            command[service.params[i]] = parameters[i];
        }

        this.logger.start(serviceId, {command, state, service: serviceName});

        console.log(`apiService => ${serviceId} started ...`);

        try {

            let instance = this.factory(service.class),
                result = instance[service.method](...parameters);

            this.logger.success(serviceId, result);
            console.log(`apiService => ${serviceId} succeed ...`);

            this.unitOfWork.commit();

            return result;
        }
        catch (e) {

            this.unitOfWork.rollback(e);

            console.log(e);

            if (e instanceof ValidationException) {

                this.logger.invalid(serviceId, e);
                console.log(`apiService => ${serviceId} failed ...`);

                throw new ValidationException(e.errors);
            }
            else {
                this.logger.error(serviceId, e);
                console.log(`apiService => ${serviceId} failed ...`);

                throw new ValidationException(['internal error']);
            }
        }
    }

}