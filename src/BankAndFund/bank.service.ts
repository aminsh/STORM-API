import { BankCreateDTO, BankUpdateDTO } from "./bank.dto";
import { BankRepository } from "./bank.repository";
import { Bank } from "./bank.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { NotFoundException } from "../Infrastructure/Exceptions";

@Injectable()
export class BankService {
    constructor(private readonly bankRepository: BankRepository) { }

    async create(dto: BankCreateDTO): Promise<string> {

        let entity = new Bank();

        entity.title = dto.title;
        entity.accountCartNumber = dto.bankAccountCartNumber;
        entity.accountNumber = dto.accountNumber;
        entity.bank = dto.bank;
        entity.bankBranch = dto.bankBranch;
        entity.bankAccountNumber = dto.bankAccountNumber;

        await this.bankRepository.save(entity);

        return entity.id;
    }

    async update(dto: BankUpdateDTO): Promise<void> {

        let entity = await this.bankRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.title = dto.title;
        entity.accountCartNumber = dto.bankAccountCartNumber;
        entity.accountNumber = dto.accountNumber;
        entity.bank = dto.bank;
        entity.bankBranch = dto.bankBranch;
        entity.bankAccountNumber = dto.bankAccountNumber;

        await this.bankRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        /*let errors = [],
            settings = this.settingsRepository.get();

        if (settings.bankId === id)
            errors.push('حساب بانکی جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);*/

        let entity = await this.bankRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        await this.bankRepository.remove(entity);
    }
}

