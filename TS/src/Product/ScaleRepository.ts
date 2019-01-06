import {injectable} from "inversify";
import {Scale} from "./Scale";
import {EntityState} from "../Infrastructure/EntityState";
import {getRepository} from "typeorm";
import * as toResult from "asyncawait/await";
import {RepositoryBase} from "../Infrastructure/Domain/RepositoryBase";

@injectable()
export class ScaleRepository extends RepositoryBase<Scale> {

    constructor() {
        super(Scale);
    }

    findById(id: string): Scale {
        return toResult(this.repository.findOne({id, branchId: this.state.branchId}));
    }

    save(entity: Scale, state: EntityState): void {

        super.setCreation(entity, state);

        toResult(this.repository.save(entity));
    }

    remove(entity: Scale) {

        toResult(this.repository.remove(entity));
    }
}