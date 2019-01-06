import {body, Controller, Delete, Get, parameter, Post, Put} from "../../Infrastructure/ExpressFramework";
import {FundService} from "../Application/FundService";
import {Inject} from "../../Infrastructure/DependencyInjection";
import {FundCreateDTO, FundUpdateDTO} from "../Application/FundDTO";

@Controller("/v1/funds", "ShouldHaveBranch")
export class FundController {

    @Inject("FundService") fundService: FundService;

    @Post("/")
    async create(@body() dto: FundCreateDTO): Promise<any> {

        const id = await this.fundService.create(dto);

        return {id};
    }

    @Put("/:id")
    async update(@parameter('id') id: string, @body() dto: FundUpdateDTO): Promise<any> {

        dto.id = id;

        await this.fundService.update(dto);

        return {id};
    }

    @Delete("/:id")
    async remove(req): Promise<void> {

        await this.fundService.remove(req.params.id);
    }

}