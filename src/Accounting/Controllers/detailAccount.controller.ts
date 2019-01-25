import {Body, Parameters, Controller, Delete, Get, Post, Put} from "../../Infrastructure/ExpressFramework";
import {Inject} from "../../Infrastructure/DependencyInjection";
import {DetailAccountService} from "../Application/detailAccount.service";
import {DetailAccountCreateDTO, DetailAccountUpdateDTO} from "../Application/detailAccount.DTOs";
import {ShouldHaveBranchMiddleware} from "../../Branch/shouldHaveBranch.middleware";
import {Validate} from "../../Infrastructure/Validator/Validate";

@Controller("/v1/detail-accounts", {middleware: [ShouldHaveBranchMiddleware]})
export class DetailAccountController {

    @Inject("DetailAccountService") detailAccountService: DetailAccountService;

    @Post("/")
    async create(@Body() dto: DetailAccountCreateDTO): Promise<any> {
        const id = await this.detailAccountService.create(dto);

        return {id};
    }

    @Put("/:id")
    @Validate(DetailAccountUpdateDTO, {
        index: 1,
        transform: (id: string, dto: any) => dto.id = id
    })
    async update(@Parameters() id: string, @Body() dto: DetailAccountUpdateDTO): Promise<any> {
        await this.detailAccountService.update(dto);
        return {id};
    }

    @Delete("/:id")
    async remove(@Parameters() id: string): Promise<void> {
        await this.detailAccountService.remove(id);
    }
}