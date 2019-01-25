import { Controller, Post, Body, Parameters, Put } from "../../Infrastructure/ExpressFramework";
import { ShouldHaveBranchMiddleware } from "src/Branch/shouldHaveBranch.middleware";
import { DimensionService } from "../Application/dimension.service";
import { Validate } from "../../Infrastructure/Validator/Validate";
import { DimensionCreateDTO, DimensionUpdateDTO } from "../Application/dimension.DTO";

@Controller('/v1/dimensions', { middleware: [ShouldHaveBranchMiddleware] })
export class DimensionController {
    constructor(private readonly dimensionService: DimensionService) { }

    @Post('/category/:categoryId')
    @Validate(DimensionCreateDTO, { transform: (categoryId, dto) => dto.categoryId = categoryId })
    async create(@Parameters('categoryId') categoryId: number, @Body() dto: DimensionCreateDTO): Promise<any> {
        const id = await this.dimensionService.create(dto);
        return { id };
    }

    @Put('/:id')
    @Validate(DimensionUpdateDTO, { transform: (id, dto) => dto.id = id })
    async update(@Parameters('id') id: string, @Body() dto: DimensionUpdateDTO): Promise<any> {
        await this.dimensionService.update(dto);
        return { id };
    }

    async remove(@Parameters('id') id: string): Promise<void> {
        await this.dimensionService.remove(id);
    }
}