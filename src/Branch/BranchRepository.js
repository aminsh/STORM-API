import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class BranchRepository {

    tableName = "branches";

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    findById(id) {
        const knex = this.dbContext.instance;

        return toResult(knex.select('*').from(this.tableName).where({id}).first());
    }

    create(data) {

        const knex = this.dbContext.instance;

        data.id = Utility.TokenGenerator.generate128Bit();

        toResult(knex(this.tableName).insert(data));
    }

    update(id, data) {

        const knex = this.dbContext.instance;

        return toResult(knex(this.tableName).where({id}).update(data));
    }

    findMemberByToken(token){
        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*').from('userInBranches')
                .where({token}).first()
        );
    }

    findMember(id, userId) {

        const knex = this.dbContext.instance;

        return toResult(knex.select('*').from('userInBranches').where({branchId: id, userId}).first());
    }

    addUser(id, member) {

        const knex = this.dbContext.instance;

        member.branchId = id;

        toResult(knex('userInBranches').insert(member));
    }

    removeUser(id, userId) {

        const knex = this.dbContext.instance;

        toResult(knex('userInBranches').where({branchId: id, userId}).del());
    }

    updateUser(id, userId, data){
        const knex = this.dbContext.instance;

        toResult(knex('userInBranches').where({branchId: id, userId}).update(data));
    }
}