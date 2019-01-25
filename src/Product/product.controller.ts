import {Body, Controller, Get, Parameters, Post, Put} from "../Infrastructure/ExpressFramework";
import {ProductService} from "./product.service";
import {ProductCreateDTO, ProductUpdateDTO} from "./dto/product.DTO";
import {ShouldHaveBranchMiddleware} from "../Branch/shouldHaveBranch.middleware";
import {getCurrentContext} from "../Infrastructure/ApplicationCycle";
import {Product} from "./product.entity";
import {Validate} from "../Infrastructure/Validator/Validate";

@Controller('/v1/products', {middleware: [ShouldHaveBranchMiddleware]})
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Post()
    @Validate(ProductCreateDTO)
    async create(@Body() dto: ProductCreateDTO): Promise<any> {
        let product = await this.productService.create(dto);
        return {id: product.id};
    }

    @Put('/:id')
    @Validate(ProductUpdateDTO,
        {index: 1, transform: (id: string, dto: any) => dto.id = id})
    async update(@Parameters('id') id: string, @Body() dto: ProductUpdateDTO): Promise<any> {
        await this.productService.update(dto);
        return {id};
    }

}