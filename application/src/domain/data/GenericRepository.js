import {getRepository} from "typeorm";
import aw from "asyncawait/await";
import {inject, injectable} from "inversify";

const Guid = Utility.Guid;

@injectable()
export class GenericRepository {

    /** @private */
    repository = undefined;

    /** @private */
    @inject("State")
    _state = undefined;


    /**@return {Repository}*/
    of(Type) {
        return new Repository(this._state, Type);
    }
}

export class Repository {

    constructor(state, Type) {
        this._state = state;
        this.Type = Type;
        this.repository = getRepository(Type);
    }

    save(entityOrEntities) {

        if (Array.isArray(entityOrEntities))

            entityOrEntities.forEach(e => {
                e.branchId = this._state.branchId;
                if (!e.id)
                    e.id = Guid.new();
            });
        else {
            entityOrEntities.branchId = this._state.branchId;
            if (!entityOrEntities.id)
                entityOrEntities.id = Guid.new();

        }

        return aw(this.repository.save(entityOrEntities));
    }

    remove(entityOrEntity) {
        return this.repository.remove(entityOrEntity);
    }

    findById(id) {

        return aw(this.findOne({where: {id, branchId: this._state.branchId}}))
    }

    findOne(options) {

        this._setBranchCriteria(options);

        return aw(this.repository.findOne(options));
    }

    find(options) {

        this._setBranchCriteria(options);

        return aw(this.repository.findOne(options));
    }


    /**
     * @private
     */
    _setBranchCriteria(options) {
        options = (options || {where: {}});

        options.where.branchId = this._state.branchId;
    }

}