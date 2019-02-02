import { ScaleRepository } from "./scale.repository";
import { Scale } from "./scale.entity";
import { ProductRepository } from "./product.repository";
import { BadRequestException, NotFoundException } from "../Infrastructure/Exceptions";
import { ScaleCreateDTO, ScaleUpdateDTO } from "./dto/scale.DTO";
import { Injectable } from "../Infrastructure/DependencyInjection";

@Injectable()
export class ScaleService {
    constructor(
        private scaleRepository: ScaleRepository,
        private productRepository: ProductRepository) {
    }

    async create(dto: ScaleCreateDTO): Promise<Scale> {
        let entity = new Scale();
        entity.title = dto.title;

        await this.scaleRepository.save(entity);

        return entity;
    }

    async update(dto: ScaleUpdateDTO): Promise<Scale> {
        let entity = await this.scaleRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.title = dto.title;

        await this.scaleRepository.save(entity);

        return entity;
    }

    async remove(id: string): Promise<void> {
        let errors: string[] = [];
        const entity = await this.scaleRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const usedCurrentScale = await this.productRepository.findOne({ scale: entity });

        if (usedCurrentScale)
            errors.push('واحد اندازه گیری جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.scaleRepository.remove(entity);
    }
}