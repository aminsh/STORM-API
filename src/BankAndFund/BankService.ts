import {Inject, Injectable} from "../../../oldSource/TS/src/Infrastructure/DependencyInjection";
import {BankCreateDTO, BankUpdateDTO} from "./BankDTO";
import {BankRepository} from "./BankRepository";
import {Bank} from "./Bank";
import {EntityState} from "../../../oldSource/TS/src/Infrastructure/EntityState";

@Injectable()
export class BankService {

    @Inject("DetailAccountRepository") bankRepository: BankRepository;

    @Inject("SettingsRepository") settingsRepository;

    async create(dto: BankCreateDTO): Promise<string> {

        let entity = new Bank();

        entity.title = dto.title;
        entity.accountCartNumber = dto.bankAccountCartNumber;
        entity.accountNumber = dto.accountNumber;
        entity.bank = dto.bank;
        entity.bankBranch = dto.bankBranch;
        entity.bankAccountNumber = dto.bankAccountNumber;

        await this.bankRepository.save(entity, EntityState.CREATED);

        return entity.id;
    }

    async update(dto: BankUpdateDTO): Promise<void> {

        let entity = await this.bankRepository.findById(dto.id);

        entity.title = dto.title;
        entity.accountCartNumber = dto.bankAccountCartNumber;
        entity.accountNumber = dto.accountNumber;
        entity.bank = dto.bank;
        entity.bankBranch = dto.bankBranch;
        entity.bankAccountNumber = dto.bankAccountNumber;

        await this.bankRepository.save(entity, EntityState.MODIFIED);
    }

    async remove(id: string): Promise<void> {
        let errors = [],
            settings = this.settingsRepository.get();

        if (settings.bankId === id)
            errors.push('حساب بانکی جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = await this.bankRepository.findById(id);

        await this.bankRepository.remove(entity);
    }
}

