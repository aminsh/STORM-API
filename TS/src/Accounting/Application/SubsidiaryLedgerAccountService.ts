import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {SubsidiaryLedgerAccountRepository} from "../Domain/subsidiaryLedgerAccountRepository";
import {
    SubsidiaryLedgerLedgerAccountCreateDTO,
    SubsidiaryLedgerLedgerAccountUpdateDTO
} from "./SubsidiaryLedgerLedgerAccountDTO";
import {Validate} from "../../Infrastructure/Validator/Validate";
import {GeneralLedgerAccountRepository} from "../Domain/GeneralLedgerAccountRepository";
import {SubsidiaryLedgerAccount} from "../Domain/SubsidiaryLedgerAccount";
import {Not} from "typeorm";

@Injectable()
export class SubsidiaryLedgerAccountService {
    @Inject('SubsidiaryLedgerAccountRepository') subsidiaryLedgerAccountRepository: SubsidiaryLedgerAccountRepository;
    @Inject('GeneralLedgerAccountRepository') generalLedgerAccountRepository: GeneralLedgerAccountRepository;

    @Validate(SubsidiaryLedgerLedgerAccountCreateDTO)
    async create(dto: SubsidiaryLedgerLedgerAccountCreateDTO): Promise<string> {
        const gla = await this.generalLedgerAccountRepository.findById(dto.generalLedgerAccountId);

        if (!gla)
            throw new NotFoundException();

        const sla = await this.subsidiaryLedgerAccountRepository.findOne({code: dto.code});

        if (sla)
            throw new ValidationException(['کد تکراری است']);

        let entity = new SubsidiaryLedgerAccount();

        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;
        entity.balanceType = dto.balanceType;
        entity.hasDetailAccount = dto.hasDetailAccount;
        entity.hasDimension1 = dto.hasDimension1;
        entity.hasDimension2 = dto.hasDimension2;
        entity.hasDimension3 = dto.hasDimension3;

        await this.subsidiaryLedgerAccountRepository.save(entity);

        return entity.id;
    }

    @Validate(SubsidiaryLedgerLedgerAccountUpdateDTO)
    async update(dto: SubsidiaryLedgerLedgerAccountUpdateDTO): Promise<void> {
        const entity = await this.subsidiaryLedgerAccountRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        const sla = await this.subsidiaryLedgerAccountRepository.findOne({code: dto.code, id: Not(dto.id)});

        if (sla)
            throw new ValidationException(['کد تکراری است']);

        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;
        entity.balanceType = dto.balanceType;
        entity.hasDetailAccount = dto.hasDetailAccount;
        entity.hasDimension1 = dto.hasDimension1;
        entity.hasDimension2 = dto.hasDimension2;
        entity.hasDimension3 = dto.hasDimension3;

        await this.subsidiaryLedgerAccountRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
       /*TODO if (this.subsidiaryLedgerAccountRepository.isUsedOnJournalLines(id))
            errors.push('حساب معین جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

        if ((this.settings.subsidiaryLedgerAccounts || []).asEnumerable().any(item => item.id === id))
            errors.push('حساب معین جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');*/

        const entity = await this.subsidiaryLedgerAccountRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        await this.subsidiaryLedgerAccountRepository.remove(entity);
    }
}