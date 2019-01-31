import {
    Body,
    Controller,
    Delete,
    Get,
    Parameters,
    Post,
    Put
} from "../Infrastructure/ExpressFramework";
import { FundService } from "./FundService";
import { FundCreateDTO, FundUpdateDTO } from "./fund.dto";
import { ShouldHaveBranchMiddleware } from "../Branch/shouldHaveBranch.middleware";

@Controller("/v1/funds", { middleware: [ ShouldHaveBranchMiddleware ] })
export class FundController {
    constructor(private readonly fundService: FundService) { }

    @Post("/")
    async create(@Body() dto: FundCreateDTO): Promise<any> {

        const id = await this.fundService.create(dto);

        return { id };
    }

    @Put("/:id")
    async update(@Parameters('id') id: string, @Body() dto: FundUpdateDTO): Promise<any> {

        dto.id = id;

        await this.fundService.update(dto);

        return { id };
    }

    @Delete("/:id")
    async remove(req): Promise<void> {

        await this.fundService.remove(req.params.id);
    }

}