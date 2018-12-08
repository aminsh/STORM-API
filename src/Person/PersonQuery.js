import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class PersonQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select('*', knex.raw(`coalesce("code", '') || ' ' || title as display`))
                    .from('detailAccounts')
                    .where({branchId, detailAccountType: 'person'})
                    .as('base')
            });

        return toResult(
            Utility.kendoQueryResolve(query, parameters, this._view.bind(this))
        );
    }

    getById(id) {

        let entity = toResult(
            this.knex
                .select('*')
                .from('detailAccounts')
                .where({
                    branchId: this.branchId,
                    detailAccountType: 'person',
                    id
                })
                .first()
        );

        return this._view(entity);
    }

    getAllPeopleWithRoleFilter(parameters, personRole) {
        return this.getAllByDetailAccountTypeAndPersonRole(parameters, 'person', personRole);
    }

    getAllByDetailAccountTypeAndPersonRole(parameters, type, personRole) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                    .from('detailAccounts')
                    .innerJoin(knex.raw(`(
                            select id, "personRoles", TRIM(pr::TEXT,'""')
                            FROM   "detailAccounts", json_array_elements("personRoles") as pr
                            where "personRoles" is not null
                                    AND TRIM(pr::TEXT,'""') = '${personRole}'
                        )as "role"`),'role.id','detailAccounts.id')
                    .where('branchId', branchId)
                    .where('detailAccountType', type)
                    .as('baseDetailAccounts');
            }).as('baseDetailAccounts');

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    _view(entity) {

        if(!entity)
            throw new NotFoundException();

        const enums = this.enums;

        return {
            id: entity.id,
            referenceId: entity.referenceId,
            code: entity.code,
            display: entity.display,
            title: entity.title,
            description: entity.description,
            address: entity.address,
            postalCode: entity.postalCode,
            province: entity.province,
            city: entity.city,
            phone: entity.phone,
            mobile: entity.mobile,
            fax: entity.fax,
            nationalCode: entity.nationalCode,
            economicCode: entity.economicCode,
            registrationNumber: entity.registrationNumber,
            email: entity.email,
            personType: entity.personType,
            personTypeDisplay: entity.personType
                ? enums.PersonType().getDisplay(entity.personType)
                : '',
            contacts: entity.contacts,

            countOfSale: entity.countOfSale,
            lastSaleDate: entity.lastSaleDate,
            sumSaleAmount: entity.sumSaleAmount,
            sumDebtor: entity.sumDebtor,
            sumCreditor: entity.sumCreditor,
            personRoles: entity.personRoles,
            priceListId: entity.priceListId
        }
    }
}