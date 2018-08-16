import {injectable, inject} from "inversify";

@injectable()
export class Context {

    @inject("HttpContext") _httpContext = undefined;

    get request() {
        return this._httpContext.request;
    }

    get user() {
        return this._httpContext.request.user;
    }

    get branchId() {
        return this._httpContext.request.branchId;
    }

    get fiscalPeriodId() {
        return this._httpContext.request.fiscalPeriodId;
    }
}