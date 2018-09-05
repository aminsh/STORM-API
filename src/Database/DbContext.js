import {injectable, inject} from "inversify";

@injectable()
export class DbContext {

    @inject("DefaultKnex") _defaultKnex = undefined;

    get instance() {
        return this._defaultKnex;
    }
}