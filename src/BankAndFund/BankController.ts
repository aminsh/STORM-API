import {Controller, Delete, Get, Post, Put, body, parameter} from "../../../oldSource/TS/src/Infrastructure/ExpressFramework";
import {BankService} from "./BankService";
import {Inject} from "../../../oldSource/TS/src/Infrastructure/DependencyInjection";
import {BankCreateDTO, BankUpdateDTO} from "./BankDTO";

@Controller("/v1/banks", "ShouldHaveBranch")
export class BankController {

    @Inject("BankService") bankService: BankService;

    @Post("/")
    async create(@body() dto: BankCreateDTO): Promise<any> {
        const id = await this.bankService.create(dto);

        return {id};
    }

    @Put("/:id")
    async update(@parameter('id') id: string, @body() dto: BankUpdateDTO): Promise<any> {

        await this.bankService.update(dto);

        return {id};
    }

    @Delete("/:id")
    async remove(req): Promise<void> {
        await this.bankService.remove(req.params.id);
    }
}