import { Injectable } from "../../Infrastructure/DependencyInjection";
import { DetailAccountRepository } from "../Domain/detailAccount.repository";
import { DetailAccountCreateDTO, DetailAccountUpdateDTO } from "./detailAccount.DTOs";
import { DetailAccount } from "../Domain/detailAccount.entity";
import { JournalRepository } from "../Domain/journal.repository";
import { BadRequestException, NotFoundException } from "../../Infrastructure/Exceptions";

@Injectable()
export class DetailAccountService {
    constructor(private readonly detailAccountRepository: DetailAccountRepository,
        private readonly journalRepository: JournalRepository) { }

    async create(dto: DetailAccountCreateDTO): Promise<string> {

        let entity = new DetailAccount();

        entity.title = dto.title;
        entity.code = dto.code;
        entity.description = dto.description;
        entity.reference = dto.referenceId;

        await this.detailAccountRepository.save(entity);

        return entity.id;
    }

    async update(dto: DetailAccountUpdateDTO): Promise<void> {
        let entity = await this.detailAccountRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;
        entity.reference = dto.referenceId;

        await this.detailAccountRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.detailAccountRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const isUsedDetailAccount = await this.journalRepository.findLines({ detailAccount: { id } });

        if (isUsedDetailAccount)
            throw new BadRequestException(['حساب تفصیل جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد']);

        await this.detailAccountRepository.remove(entity);
    }
}
