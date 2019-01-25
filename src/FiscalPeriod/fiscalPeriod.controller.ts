import { Controller, Post, Body, Put, Parameters, Delete } from "../Infrastructure/ExpressFramework";
import { ShouldHaveBranchMiddleware } from "../Branch/shouldHaveBranch.middleware";
import { FiscalPeriodService } from "./fiscalPeriod.service";
import { Validate } from "../Infrastructure/Validator/Validate";
import { FiscalPeriodCreateDTO, FiscalPeriodUpdateDTO } from "./fiscalPeriod.dto";

@Controller('/v1/fiscal-periods', { middleware: [ShouldHaveBranchMiddleware] })
export class FiscalPeriodController {
    constructor(private readonly fiscalPeriodService: FiscalPeriodService) { }

    @Post('/')
    @Validate(FiscalPeriodCreateDTO)
    async create(@Body() dto: FiscalPeriodCreateDTO): Promise<any> {
        const id = await this.fiscalPeriodService.create(dto);
        return { id };
    }

    @Put('/:id')
    @Validate(FiscalPeriodUpdateDTO, {
        index: 1,
        transform: (id, dto) => dto.id = id
    })
    async update(@Parameters('id') id: string, @Body() dto: FiscalPeriodUpdateDTO): Promise<any> {
        await this.fiscalPeriodService.update(dto);
        return { id };
    }

    @Delete(':id')
    async remove(@Parameters('id') id: string): Promise<void> { 
        await this.fiscalPeriodService.remove(id);
    }
}