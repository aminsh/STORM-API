import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class BranchQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    @inject("State")
    /**@type{IState}*/ state = undefined;

    tableName = "branches";

    find(where, single) {

        const knex = this.dbContext.instance;

        const tableName = this.tableName;

        let query = knex.select('*')
            .from(function () {
                this.select(
                    'branches.id',
                    'is_archive',
                    'name',
                    'logo',
                    'ownerId',
                    'userInBranches.userId',
                    'userInBranches.token',
                    'userInBranches.isOwner',
                    'status',
                    'address',
                    'phone',
                    'mobile',
                    'webSite',
                    'ownerName',
                    'city',
                    'nationalCode',
                    'postalCode',
                    'fax',
                    'registrationNumber',
                    'province',
                    'branches.createdAt')
                    .from(tableName)
                    .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
                    .as("base")
            });

        if (where) {
            where.is_archive = false;
            query.where(where);
        }
        else query.where({is_archive: false});

        if (single)
            query.first();

        let result = toResult(query);

        return single ? this._map(result) : result.map(this._map);
    }

    _map(item) {

        if (!item)
            return null;

        return {
            id: item.id,
            name: item.name,
            ownerId: item.ownerId,
            isOwner: item.isOwner,
            logo: item.logo,
            token: item.token,
            status: item.status,
            address: item.address,
            phone: item.phone,
            mobile: item.mobile,
            city: item.city,
            webSite: item.webSite,
            ownerName: item.ownerName,
            createdAt: item.createdAt,
            nationalCode: item.nationalCode,
            postalCode: item.postalCode,
            fax: item.fax,
            registrationNumber: item.registrationNumber,
            province: item.province,
            createdAtToPersian: Utility.PersianDate.getDate(item.createdAt)
        };
    }

    getMembers(id, parameters) {

        if(id !== this.state.branchId)
            throw new ValidationSingleException('شما به این کسب و کار دسترسی ندارید');

        const knex = this.dbContext.instance;


        let query = knex.from(function () {
            this.select(
                knex.raw('users.id as "userId"'),
                'users.email',
                'users.name',
                'users.image',
                'userInBranches.token',
                'userInBranches.id',
                'userInBranches.isOwner')
                .from('users')
                .leftJoin('userInBranches', 'users.id', 'userInBranches.userId')
                .where('userInBranches.branchId', id)
                .as('base');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, item => item));
    }

    isUsedTrailBeforeByUser(userId) {

        const knex = this.dbContext.instance,

            user = toResult(knex.select('*').from('users').where({id: userId}).first()),

            query = knex.select('storm_plans.id')
                .from('storm_orders')
                .leftJoin('storm_plans', 'storm_orders.planId', 'storm_plans.id')
                .leftJoin(this.tableName, 'storm_orders.branchId', this.tableName + '.id')
                .leftJoin('users', `${this.tableName}.ownerId`, 'users.id')
                .where('storm_plans.category', 'Trial');

        let where = '';

        if(user.email)
            where = `users.email ILIKE '${user.email}' `;

        if(user.mobile)
            where += `${where ? 'OR' : ''} users.mobile = '${user.mobile}'`;

        if(where.length === 0)
            `users.id = '${user.id}'`;
        else
            where = `(${where})`;

        query.whereRaw(where);

        return !!toResult(query.first());
    }
}