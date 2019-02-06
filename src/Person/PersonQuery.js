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
        return this.getAllByDetailAccountTypeAndPersonRole(parameters, personRole);
    }

    getAllByDetailAccountTypeAndPersonRole(parameters, personRole) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                let q = this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                    .from('detailAccounts')
                    .where('branchId', branchId)
                    .where('detailAccountType', 'person');

                if(personRole === 'marketer')
                    q.where('isMarketer', true);

                    q.as('base');
            });

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
            isMarketer: entity.isMarketer,
            marketerCommissionRate: entity.marketerCommissionRate,
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