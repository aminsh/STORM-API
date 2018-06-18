import {injectable, inject} from "inversify";

@injectable()
export class Context {

    @inject("HttpContext") _httpContext = undefined;

    get user() {
        return this._httpContext.request.user;
    }
}