import { Injectable } from "../Infrastructure/DependencyInjection";
import { FiscalPeriodCreateDTO, FiscalPeriodUpdateDTO } from "./fiscalPeriod.dto";
import { Validate } from "../Infrastructure/Validator/Validate";
import { FiscalPeriod } from "./fiscalPeriod.entity";
import { FiscalPeriodRepository } from "./fiscalPeriod.repository";

@Injectable()
export class FiscalPeriodService {
    constructor(private readonly fiscalPeriodRepository: FiscalPeriodRepository) { }

    async create(dto: FiscalPeriodCreateDTO): Promise<string> {
        let entity = new FiscalPeriod();

        entity.title = dto.title;
        entity.minDate = dto.maxDate;
        entity.maxDate = dto.maxDate;

        await this.fiscalPeriodRepository.save(entity);

        return entity.id;
    }

    async update(dto: FiscalPeriodUpdateDTO): Promise<void> {
        let entity = await this.fiscalPeriodRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.title = dto.title;
        entity.minDate = dto.maxDate;
        entity.maxDate = dto.maxDate;

        await this.fiscalPeriodRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        if (!id)
            throw new NotFoundException();

        let entity = await this.fiscalPeriodRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        await this.fiscalPeriodRepository.remove(entity);
    }
}