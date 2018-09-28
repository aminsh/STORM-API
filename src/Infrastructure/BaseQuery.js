import {inject, injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class BaseQuery {

    @inject("State")
    /** @type {IState} */state = undefined;

    @inject("DbContext")
    /** @type {DbContext}*/ dbContext = undefined;

    knex = undefined;
    branchId = undefined;
    userId = undefined;

    @postConstruct()
    init() {

        this.knex = this.dbContext.instance;
        this.branchId = this.state.branchId;
        this.userId = this.state.user.id;
    }

    canView() {
        const userId = this.userId,
            branchId = this.branchId;

        if (!userId) return true;

        let isOwner = toResult(this.knex.select('isOwner')
                .from('userInBranches')
                .where('userId', userId)
                .where('branchId', branchId)
                .first())
                .isOwner,
            isAdmin = toResult(this.knex.select('roles.isAdmin')
                .from('userInRole')
                .innerJoin('roles', 'roles.id', 'userInRole.roleId')
                .where('userInRole.userId', userId)
                .where('userInRole.branchId', branchId)),

            userRoleId = toResult(this.knex.select('roleId')
                .from('userInRole')
                .where('userInRole.userId', userId)
                .where('userInRole.branchId', branchId)),

            noPermission = userRoleId.length === 0;


        isAdmin = isAdmin.length > 0 ? isAdmin[0].isAdmin : false;
        isOwner = isOwner || false;

        return isOwner || isAdmin || noPermission;
    }

    modify(queryBuilder, branchId, userId, isOwner, tableName) {
        const knex = this.knex;

        queryBuilder.where((tableName && knex.raw(`"${tableName}"."branchId"`)) || 'branchId', branchId);
        isOwner !== true && queryBuilder.where((tableName && knex.raw(`"${tableName}"."createdById"`)) || 'createdById', userId);
    }


}