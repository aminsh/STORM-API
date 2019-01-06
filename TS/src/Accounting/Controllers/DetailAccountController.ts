import {body, Controller, Delete, Get, parameter, Post, Put} from "../../Infrastructure/ExpressFramework";
import {Inject} from "../../Infrastructure/DependencyInjection";
import {DetailAccountService} from "../Application/DetailAccountService";
import {DetailAccountCreateDTO, DetailAccountUpdateDTO} from "../Application/DetailAccountDTOs";

@Controller("/v1/detail-accounts", "ShouldHaveBranch")
class DetailAccountController {

    @Inject("DetailAccountService") detailAccountService: DetailAccountService;

    @Post("/")
    async create(@body() dto: DetailAccountCreateDTO): Promise<any> {
        const id = await this.detailAccountService.create(dto);

        return {id};
    }

    @Put("/:id")
    async update(@parameter() id: string, @body() dto: DetailAccountUpdateDTO): Promise<any> {
        dto.id = id;

        await this.detailAccountService.update(dto);

        return {id};
    }

    @Delete("/:id")
    async remove(@parameter() id: string): Promise<void> {
        await this.detailAccountService.remove(id);
    }
}