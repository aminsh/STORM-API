import { Body, Controller, Delete, Parameters, Post, Put } from "../../Infrastructure/ExpressFramework";
import { AccountCategoryService } from "../Application/accountCategory.service";
import { GeneralLedgerAccountService } from "../Application/generalLedgerAccount.service";
import { SubsidiaryLedgerAccountService } from "../Application/subsidiaryLedgerAccount.service";
import { AccountCategoryCreateDTO, AccountCategoryUpdateDTO } from "../Application/accountCategory.DTO";
import { GeneralLedgerAccountCreateDTO, GeneralLedgerAccountUpdateDTO } from "../Application/generalLedgerAccount.DTO";
import {
    SubsidiaryLedgerLedgerAccountCreateDTO,
    SubsidiaryLedgerLedgerAccountUpdateDTO
} from "../Application/subsidiaryLedgerLedgerAccount.DTO";
import { ShouldHaveBranchMiddleware } from "../../Branch/shouldHaveBranch.middleware";
import { Validate } from "../../Infrastructure/Validator/Validate";

@Controller("/v1/chart-of-accounts", { middleware : [ ShouldHaveBranchMiddleware ] })
export class ChartOfAccountController {
    constructor(private readonly accountCategoryService: AccountCategoryService,
                private readonly generalLedgerAccountService: GeneralLedgerAccountService,
                private readonly subsidiaryLedgerAccountService: SubsidiaryLedgerAccountService) { }

    @Post("/category")
    @Validate(AccountCategoryCreateDTO)
    async createCategory(@Body() dto: AccountCategoryCreateDTO): Promise<any> {
        const id = await this.accountCategoryService.create(dto);
        return { id };
    }

    @Put("/category/:id")
    @Validate(AccountCategoryUpdateDTO, { index : 1, transform : (id: string, dto: any) => dto.id = id })
    async updateCategory(@Parameters('id') id: string, @Body() dto: AccountCategoryUpdateDTO): Promise<any> {
        await this.accountCategoryService.update(dto);
        return { id };
    }

    @Delete("/category/:id")
    async removeCategory(@Parameters('id') id: string): Promise<void> {
        await this.accountCategoryService.remove(id);
    }

    @Post("/general-ledger-accounts")
    async createGeneralLedgerAccount(@Body() dto: GeneralLedgerAccountCreateDTO): Promise<any> {
        const id = await this.generalLedgerAccountService.create(dto);
        return { id };
    }

    @Put("/general-ledger-accounts/:id")
    @Validate(GeneralLedgerAccountUpdateDTO, { index : 1, transform : (id: string, dto: any) => dto.id = id })
    async updateGeneralLedgerAccount(@Parameters('id') id: string, @Body() dto: GeneralLedgerAccountUpdateDTO): Promise<any> {
        await this.generalLedgerAccountService.update(dto);
        return { id };
    }

    @Delete("/general-ledger-accounts/:id")
    async removeGeneralLedgerAccount(@Parameters('id') id: string): Promise<void> {
        await this.generalLedgerAccountService.remove(id);
    }

    @Post("/subsidiary-ledger-accounts/:generalLedgerAccountId")
    async createSubsidiaryLedgerAccount(
        @Parameters('generalLedgerAccountId') generalLedgerAccountId: string,
        @Body() dto: SubsidiaryLedgerLedgerAccountCreateDTO
    ): Promise<any> {
        dto.generalLedgerAccountId = generalLedgerAccountId;
        const id = await this.subsidiaryLedgerAccountService.create(dto);
        return { id };
    }

    @Put("/subsidiary-ledger-accounts/:id")
    @Validate(SubsidiaryLedgerLedgerAccountUpdateDTO, {
        index : 1,
        transform : (id: string, dto: any) => dto.id = id
    })
    async updateSubsidiaryLedgerAccount(@Parameters('id') id: string, @Body() dto: SubsidiaryLedgerLedgerAccountUpdateDTO): Promise<any> {
        await this.subsidiaryLedgerAccountService.update(dto);
        return { id };
    }

    @Delete("/subsidiary-ledger-accounts/:id")
    async removeSubsidiaryLedgerAccount(@Parameters('id') id: string): Promise<void> {
        await this.subsidiaryLedgerAccountService.remove(id);
    }
}