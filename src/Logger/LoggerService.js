import {injectable, inject} from "inversify";

@injectable()
export class LoggerService {

    @inject("LoggerRepository")
    /** @type {LoggerRepository}*/ loggerRepository = undefined;

    @inject("HttpContext") httpContext = undefined;

    get data() {

        let req = this.httpContext.request,

            state = {
                fiscalPeriodId: req.fiscalPeriodId,
                user: req.user,
                query: req.query,
                body: req.body,
                params: req.params,
                headers: req.headers,
                method: req.method,
                originalUrl: req.originalUrl,
                apiCaller: req.apiCaller,
                referrer: req.get('Referrer')
            };

        return {
            id: req.requestId,
            branchId: req.branchId,
            service: `${req.controller}.${req.action}`,
            command: {body: req.body, params: req.params, query: req.query},
            state: JSON.stringify(state)
        };
    }

    start() {

        this.loggerRepository.create(entity);
    }

    success(result, serviceName) {

        let data = Object.assign({}, this.data, {
            updatedAt: new Date,
            status: 'success',
            result: JSON.stringify(result),
            service: serviceName || this.data.service
        });

        this.loggerRepository.create(data);
    }

    error(error) {

        let data = Object.assign({}, this.data, {
            updatedAt: new Date,
            status: 'error',
            result: JSON.stringify({message: error.message, stack: error.stack, errors: error.errors})
        });

        this.loggerRepository.create(data);
    }

    invalid(error, serviceName) {

        let data = Object.assign({}, this.data, {
            updatedAt: new Date,
            status: 'invalid',
            result: JSON.stringify(error),
            service: serviceName || this.data.service
        });

        this.loggerRepository.create(data);
    }
}