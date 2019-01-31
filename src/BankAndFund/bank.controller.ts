import { BankService } from "./BankService";
import { BankCreateDTO, BankUpdateDTO } from "./bank.dto";
import { Body, Controller, Delete, Parameters, Post, Put } from "../Infrastructure/ExpressFramework";
import { ShouldHaveBranchMiddleware } from "../Branch/shouldHaveBranch.middleware";

@Controller("/v1/banks", {middleware: [ShouldHaveBranchMiddleware]})
export class BankController {
    constructor(private readonly bankService: BankService) { }

    @Post("/")
    async create(@Body() dto: BankCreateDTO): Promise<any> {
        const id = await this.bankService.create(dto);

        return { id };
    }

    @Put("/:id")
    async update(@Parameters('id') id: string, @Body() dto: BankUpdateDTO): Promise<any> {

        await this.bankService.update(dto);

        return { id };
    }

    @Delete("/:id")
    async remove(req): Promise<void> {
        await this.bankService.remove(req.params.id);
    }
}