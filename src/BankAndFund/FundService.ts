import {Inject, Injectable} from "../../../oldSource/TS/src/Infrastructure/DependencyInjection";
import {FundCreateDTO, FundUpdateDTO} from "./FundDTO";
import {Fund} from "./Fund";
import {FundRepository} from "./FundRepository";
import {EntityState} from "../../../oldSource/TS/src/Infrastructure/EntityState";

@Injectable()
export class FundService {

    @Inject("FundRepository") fundRepository: FundRepository;

    async create(dto: FundCreateDTO): Promise<string> {

        let entity = new Fund();

        entity.title = dto.title;

        await this.fundRepository.save(entity, EntityState.CREATED);

        return entity.id;
    }

    async update(dto: FundUpdateDTO): Promise<void> {
        let entity: Fund = await this.fundRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        await this.fundRepository.save(entity, EntityState.MODIFIED);
    }

    async remove(id): Promise<void> {
        let entity: Fund = await this.fundRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        await this.fundRepository.remove(entity);
    }
}
