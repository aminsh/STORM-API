import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class BranchRepository {

    tableName = "branches";


    findById(id) {
        return toResult(knex.select('*').from(this.tableName).where({id}).first());
    }

    create(data) {

        data.id = TokenGenerator.generate128Bit();

        toResult(knex(this.tableName).insert(data));
    }

    update(id, data) {

        return toResult(knex(this.tableName).where({id}).update(data));
    }

    findMemberByToken(token){
        return toResult(
            knex.select('*').from('userInBranches')
                .where({token}).first()
        );
    }

    findMember(id, userId) {

        return toResult(knex.select('*').from('userInBranches').where({branchId: id, userId}).first());
    }

    addUser(id, member) {

        member.branchId = id;

        toResult(knex('userInBranches').insert(member));
    }

    removeUser(id, userId) {

        toResult(knex('userInBranches').where({branchId: id, userId}).del());
    }

    updateUser(id, userId, data){
        toResult(knex('userInBranches').where({branchId: id, userId}).update(data));
    }
}