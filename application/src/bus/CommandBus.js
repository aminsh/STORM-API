import {inject, injectable} from "inversify"
import serviceConfig from "../config/config.services.json";
import {ApplicationServiceLogger} from "../ApplicationLogger";

@injectable()
export class CommandBus {

    @inject("Factory<DomainService>")
    factory = undefined;

    @inject("State")
    state = undefined;

    /** @type {UserPermissionsControlDomainService}*/
    @inject("UserPermissionsControlDomainService") userPermissionsControlDomainService = undefined;

    logger = new ApplicationServiceLogger();

    send(serviceName, parameters) {

        const serviceId = Utility.Guid.create(),
            service = serviceConfig.asEnumerable().single(service => service.name === serviceName),
            state = this.state,
            command = {};

        for (let i = 0; i < service.params.length; i++) {
            command[service.params[i]] = parameters[i];
        }

        let request = this._createUrlSubject(state, service.params, command),
            havePermission = this.userPermissionsControlDomainService.controlPermission(request);
        if (!havePermission)
            throw new ValidationException(['امکان دسترسی به عملیات موردنظر وجود ندارد!']);

        this.logger.start(serviceId, {command, state, service: serviceName});

        console.log(`apiService => ${serviceId} started ...`);

        try {

            let instance = this.factory(service.class),
                result = instance[service.method](...parameters);

            this.logger.success(serviceId, result);
            console.log(`apiService => ${serviceId} succeed ...`);

            return result;
        }
        catch (e) {

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

    _createUrlSubject(state, params, command) {
        let url = state.originalUrl,
            method = state.method,
            fiscalPeriod = state.fiscalPeriodId && '?fiscalPeriodId=' + state.fiscalPeriodId;
        url = url.replace(fiscalPeriod, '');
        method = method === 'POST' ? 'create' : 'PUT' ? 'update' : 'DELETE' ? 'remove' : 'view';
        url = url.substr(url.length - 1) === '/' ? url.substring(0, url.length - 1) : url;

        let paramsName = params.asEnumerable().where(p => !p.includes('command')).toArray(),
            paramValue = paramsName.asEnumerable().select(key => command[key]).toArray(),
            paramValueInUrl = paramValue.asEnumerable().where(param => url.includes(param)).toArray(),
            haveMethod = paramValueInUrl.length > 0 ? !url.includes(paramValueInUrl + '/') : true,
            urlWithoutParam = paramValue.length > 0
                && paramValue.asEnumerable().select(value => url = url.replace('/' + value, '')).first();

        url = urlWithoutParam
            ? urlWithoutParam.substring(4).replaceAll('/', '.')
            : url.substring(4).replaceAll('/', '.');

        method = haveMethod ? '.' + method : '';
        return url + method;
    }

}