import { Injectable } from "../Infrastructure/DependencyInjection";
import { SaleRepository } from "./sale.repository";
import { EventPublisher } from "../Infrastructure/EventHandler";
import { SaleCreateDTO, SaleUpdateDTO } from "./sale.dto";
import { Sale } from "./sale.entitty";

@Injectable()
export class SaleService {
    constructor(private readonly saleRepository: SaleRepository,
                private readonly eventPublisher: EventPublisher) { }

    async create(dto: SaleCreateDTO): Promise<string> {
        let entity = new Sale();

        

    }

    async update(dto: SaleUpdateDTO): Promise<void> {

    }

    async confirm(id: string): Promise<void> {

    }

    async fix(id: string): Promise<void> {

    }

    async remove(id: string): Promise<void> {

    }

    async generateJournal(id: string): Promise<void> {

    }
}