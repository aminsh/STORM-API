import { FundCreateDTO, FundUpdateDTO } from "./fund.dto";
import { Fund } from "./fund.entity";
import { FundRepository } from "./fund.repository";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { NotFoundException } from "../Infrastructure/Exceptions";

@Injectable()
export class FundService {
    constructor(private readonly fundRepository: FundRepository) { }


    async create(dto: FundCreateDTO): Promise<string> {

        let entity = new Fund();

        entity.title = dto.title;

        await this.fundRepository.save(entity);

        return entity.id;
    }

    async update(dto: FundUpdateDTO): Promise<void> {
        let entity: Fund = await this.fundRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        await this.fundRepository.save(entity);
    }

    async remove(id): Promise<void> {
        let entity: Fund = await this.fundRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        await this.fundRepository.remove(entity);
    }
}
