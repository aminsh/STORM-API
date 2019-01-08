import {Controller, Delete, Post, Put} from "../../Infrastructure/ExpressFramework";
import {AccountCategoryService} from "../Application/AccountCategoryService";
import {GeneralLedgerAccountService} from "../Application/GeneralLedgerAccountService";
import {Inject} from "../../Infrastructure/DependencyInjection";
import {SubsidiaryLedgerAccountService} from "../Application/SubsidiaryLedgerAccountService";
import {body, parameter} from "../../Infrastructure/ExpressFramework";
import {AccountCategoryCreateDTO, AccountCategoryUpdateDTO} from "../Application/AccountCategoryDTO";
import {GeneralLedgerAccountCreateDTO, GeneralLedgerAccountUpdateDTO} from "../Application/GeneralLedgerAccountDTO";
import {
    SubsidiaryLedgerLedgerAccountCreateDTO,
    SubsidiaryLedgerLedgerAccountUpdateDTO
} from "../Application/SubsidiaryLedgerLedgerAccountDTO";

@Controller("/v1/chart-of-accounts", "ShouldHaveBranch")
class ChartOfAccountController {

    @Inject("AccountCategoryService") accountCategoryService: AccountCategoryService;

    @Inject("GeneralLedgerAccountService") generalLedgerAccountService: GeneralLedgerAccountService;

    @Inject("SubsidiaryLedgerAccountService") subsidiaryLedgerAccountService: SubsidiaryLedgerAccountService;

    @Post("/category")
    async createCategory(@body() dto: AccountCategoryCreateDTO): Promise<any> {
        const id = await this.accountCategoryService.create(dto);

        return {id};
    }

    @Put("/category/:id")
    async updateCategory(@parameter('id') id: string, @body() dto: AccountCategoryUpdateDTO): Promise<any> {
        dto.id = id;
        await this.accountCategoryService.update(dto);

        return {id};
    }

    @Delete("/category/:id")
    async removeCategory(@parameter('id') id: string): Promise<void> {
        await this.accountCategoryService.remove(id);
    }

    @Post("/general-ledger-accounts")
    async createGeneralLedgerAccount(@body() dto: GeneralLedgerAccountCreateDTO): Promise<any> {
        const id = await this.generalLedgerAccountService.create(dto);
        return {id};
    }

    @Put("/general-ledger-accounts/:id")
    async updateGeneralLedgerAccount(@parameter('id') id: string, @body() dto: GeneralLedgerAccountUpdateDTO): Promise<any> {
        dto.id = id;
        await this.generalLedgerAccountService.update(dto);

        return {id};
    }

    @Delete("/general-ledger-accounts/:id")
    async removeGeneralLedgerAccount(@parameter('id') id: string): Promise<void> {
        await this.generalLedgerAccountService.remove(id);
    }

    @Post("/subsidiary-ledger-accounts/:generalLedgerAccountId")
    async createSubsidiaryLedgerAccount(
        @parameter('generalLedgerAccountId') generalLedgerAccountId: string,
        @body() dto: SubsidiaryLedgerLedgerAccountCreateDTO
    ): Promise<any> {
        dto.generalLedgerAccountId = generalLedgerAccountId;
        const id = await this.subsidiaryLedgerAccountService.create(dto);
        return {id};
    }

    @Put("/subsidiary-ledger-accounts/:id")
    async updateSubsidiaryLedgerAccount(@parameter('id') id: string, @body() dto: SubsidiaryLedgerLedgerAccountUpdateDTO): Promise<any> {
        dto.id = id;
        await this.subsidiaryLedgerAccountService.update(dto);
        return {id};
    }

    @Delete("/subsidiary-ledger-accounts/:id")
    async removeSubsidiaryLedgerAccount(@parameter('id') id: string): Promise<void> {
        await this.subsidiaryLedgerAccountService.remove(id);
    }
}