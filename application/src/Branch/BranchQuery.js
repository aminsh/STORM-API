import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

@injectable()
export class BranchQuery {

    tableName = "branches";

    find(where, single) {

        const tableName = this.tableName;

        let query = knex.select('*')
            .from(function () {
                this.select(
                    'branches.id',
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
                    'branches.createdAt')
                    .from(tableName)
                    .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
                    .as("base")
            });

        if (where)
            query.where(where);

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
            createdAtToPersian: Utility.PersianDate.getDate(item.createdAt)
        };
    }

    getMembers(id, parameters) {

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

        return toResult(kendoQueryResolve(query, parameters, item => item));
    }
}