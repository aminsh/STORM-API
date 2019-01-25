import { Inject, Injectable } from "../../Infrastructure/DependencyInjection";
import { SubsidiaryLedgerAccountRepository } from "../Domain/subsidiaryLedgerAccount.repository";
import {
    SubsidiaryLedgerLedgerAccountCreateDTO,
    SubsidiaryLedgerLedgerAccountUpdateDTO
} from "./subsidiaryLedgerLedgerAccount.DTO";
import { GeneralLedgerAccountRepository } from "../Domain/generalLedgerAccount.repository";
import { SubsidiaryLedgerAccount } from "../Domain/subsidiaryLedgerAccount.entity";
import { Not } from "typeorm";
import { BadRequestException, NotFoundException } from "../../Infrastructure/Exceptions";
import { JournalRepository } from "../Domain/journal.repository";

@Injectable()
export class SubsidiaryLedgerAccountService {
    constructor(private readonly subsidiaryLedgerAccountRepository: SubsidiaryLedgerAccountRepository,
        private readonly generalLedgerAccountRepository: GeneralLedgerAccountRepository,
        private readonly journalRepository: JournalRepository) { }

    async create(dto: SubsidiaryLedgerLedgerAccountCreateDTO): Promise<string> {
        const gla = await this.generalLedgerAccountRepository.findById(dto.generalLedgerAccountId);

        if (!gla)
            throw new NotFoundException();

        const sla = await this.subsidiaryLedgerAccountRepository.findOne({ code: dto.code });

        if (sla)
            throw new BadRequestException(['کد تکراری است']);

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

    async update(dto: SubsidiaryLedgerLedgerAccountUpdateDTO): Promise<void> {
        const entity = await this.subsidiaryLedgerAccountRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        const sla = await this.subsidiaryLedgerAccountRepository.findOne({ code: dto.code, id: Not(dto.id) });

        if (sla)
            throw new BadRequestException(['کد تکراری است']);

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
        const entity = await this.subsidiaryLedgerAccountRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        let errors: string[] = [];

        const isUsedOnJournals = await this.journalRepository.findLines({ subsidiaryLedgerAccount: { id } });

        if (isUsedOnJournals)
            errors.push('حساب معین جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

        /*TODO if ((this.settings.subsidiaryLedgerAccounts || []).asEnumerable().any(item => item.id === id))
             errors.push('حساب معین جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');*/

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.subsidiaryLedgerAccountRepository.remove(entity);
    }
}