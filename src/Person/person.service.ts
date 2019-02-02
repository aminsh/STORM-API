import { Injectable } from "../Infrastructure/DependencyInjection";
import { PersonRepository } from "./person.repository";
import { PersonCreateDTO, PersonUpdateDTO } from "./person.dto";
import { BadRequestException, NotFoundException } from "../Infrastructure/Exceptions";
import { Person } from "./person.entity";
import { Not } from "typeorm";

@Injectable()
export class PersonService {
    constructor(private readonly personRepository: PersonRepository) { }

    async create(dto: PersonCreateDTO): Promise<Person> {
        let entity = new Person();

        if (dto.code) {
            const isCodeDuplicated = await this.personRepository.findOne({ code: dto.code });

            if (isCodeDuplicated)
                throw new BadRequestException([ 'کد تکراری است ' ]);

            entity.code = dto.code;
        } else {
            entity.code = (await this.personRepository.getCode()).toString()
        }

        entity.title = dto.title;
        entity.reference = dto.referenceId;
        entity.address = dto.address;
        entity.postalCode = dto.postalCode;
        entity.province = dto.province;
        entity.city = dto.city;
        entity.phone = dto.phone;
        entity.mobile = dto.mobile;
        entity.fax = dto.fax;
        entity.nationalCode = dto.nationalCode;
        entity.personType = dto.personType;
        entity.economicCode = dto.economicCode;
        entity.registrationNumber = dto.registrationNumber;
        entity.contacts = dto.contacts;
        entity.isMarketer = dto.isMarketer;
        entity.marketerCommisionRate = dto.marketerCommissionRate;
        entity.priceListId = dto.priceListId;

        await this.personRepository.save(entity);

        return entity;
    }

    async update(dto: PersonUpdateDTO): Promise<void> {
        let entity = await this.personRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        if (dto.code) {
            const isCodeDuplicated = await this.personRepository.findOne({ code: dto.code, id: Not(dto.id) });

            if (isCodeDuplicated)
                throw new BadRequestException([ 'کد تکراری است ' ]);

            entity.code = dto.code;
        } else {
            entity.code = entity.code || (await this.personRepository.getCode()).toString()
        }

        entity.title = dto.title;
        entity.reference = dto.referenceId;
        entity.address = dto.address;
        entity.postalCode = dto.postalCode;
        entity.province = dto.province;
        entity.city = dto.city;
        entity.phone = dto.phone;
        entity.mobile = dto.mobile;
        entity.fax = dto.fax;
        entity.nationalCode = dto.nationalCode;
        entity.personType = dto.personType;
        entity.economicCode = dto.economicCode;
        entity.registrationNumber = dto.registrationNumber;
        entity.contacts = dto.contacts;
        entity.isMarketer = dto.isMarketer;
        entity.marketerCommisionRate = dto.marketerCommissionRate;
        entity.priceListId = dto.priceListId;

        await this.personRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.personRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        //TODO check is used on Journal , Invoice, Treasury

        await this.personRepository.remove(entity);
    }

    async findOrCreate(dto?: PersonUpdateDTO): Promise<Person> {
        if (!dto) {
            dto = new PersonUpdateDTO();
            dto.referenceId = '0';
            dto.title = 'مشتری عمومی ';
        }

        let entity: Person;

        if (dto.id) {
            entity = await this.personRepository.findById(dto.id);

            if (entity)
                return entity;
        }

        if (dto.referenceId) {
            entity = await this.personRepository.findOne({ reference: dto.referenceId });

            if(entity)
                return entity;
        }
        
        return await this.create(dto as PersonCreateDTO);
    }
}