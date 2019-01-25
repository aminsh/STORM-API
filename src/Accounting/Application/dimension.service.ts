import { Injectable } from "../../Infrastructure/DependencyInjection";
import { DimensionRepository } from "../Domain/dimension.repository";
import { DimensionCreateDTO, DimensionUpdateDTO } from "./dimension.DTO";
import { BadRequestException, NotFoundException } from "../../Infrastructure/Exceptions";
import { Dimension } from "../Domain/dimension.entity";
import { Not } from "typeorm";
import { JournalRepository } from "../Domain/journal.repository";
import { Enumerable } from '../../Infrastructure/Utility'

@Injectable()
export class DimensionService {
    constructor(private readonly dimensionRepository: DimensionRepository,
                private readonly journalRepository: JournalRepository) { }

    async create(dto: DimensionCreateDTO): Promise<string> {
        if (dto.code) {
            const isCodeDuplicated = await this.dimensionRepository.findOne({ code: dto.code });
            if (isCodeDuplicated)
                throw new BadRequestException(['کد تکراری است ']);
        }

        let entity = new Dimension();

        entity.dimensionCategoryId = dto.categoryId;
        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;

        await this.dimensionRepository.save(entity);

        return entity.id;
    }

    async update(dto: DimensionUpdateDTO): Promise<void> {
        if (dto.code) {
            const isCodeDuplicated = await this.dimensionRepository.findOne({ code: dto.code, id: Not(dto.id) });
            if (isCodeDuplicated)
                throw new BadRequestException(['کد تکراری است ']);
        }

        let entity = await this.dimensionRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;

        await this.dimensionRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.dimensionRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const isUsedOnJournal: boolean[] = [
            Enumerable.from(await this.journalRepository.findLines({ dimension1: { id } })).any(),
            Enumerable.from(await this.journalRepository.findLines({ dimension2: { id } })).any(),
            Enumerable.from(await this.journalRepository.findLines({ dimension3: { id } })).any()
        ];

        if (Enumerable.from(isUsedOnJournal).any(e => e))
            throw new BadRequestException(['سطح جاری از سند های حسابداری استفاده ، امکان حذف وجود ندارد']);

        await this.dimensionRepository.remove(entity);
    }
}