import { Controller, Post, Put, Delete, Parameters, Body } from "../../Infrastructure/ExpressFramework";
import { ShouldHaveBranchMiddleware } from "../../Branch/shouldHaveBranch.middleware";
import { JournalService } from "../Application/journal.service";
import { Validate } from "../../Infrastructure/Validator/Validate";
import { JournalCreateDTO, JournalUpdateDTO, JournalMergeDTO } from "../Application/journal.DTO";

@Controller('/v1/journals', {middleware: [ ShouldHaveBranchMiddleware ]})
export class JournalController {
    constructor(private readonly journalService: JournalService) { }

    @Post('/')
    @Validate(JournalCreateDTO)
    async create(@Body() dto: JournalCreateDTO): Promise<any> {
        const id = await this.journalService.create(dto);
        return {id};
    }

    @Put('/:id')
    @Validate(JournalUpdateDTO, {
        index: 1,
        transform: (id: string, dto: any) => dto.id = id
    })
    async update(@Parameters('id') id: string, @Body() dto: JournalUpdateDTO): Promise<any> {
        await this.journalService.update(dto);
        return {id};
    }

    @Delete('/:id')
    async remove(@Parameters('id') id: string): Promise<void> {
        await this.journalService.remove(id);
    }

    @Put('/:id/confirm')
    async confirm(@Parameters('id') id: string): Promise<any> {
        //await this.journalService.confirm(dto);
        return {id};
    }

    @Put('/:id/fix')
    async fix(@Parameters('id') id: string): Promise<any> {
        //await this.journalService.fix(dto);
        return {id};
    }

    @Put('/:id/attach-image')
    async attachImage(@Parameters('id') id: string, @Body('fileName') fileName: string): Promise<any> {
        await this.journalService.attachImage(id, fileName);
        return {id};
    }

    @Post('/:id/copy')
    async copy(@Parameters('id') sourceId: string,): Promise<any> {
        const id = await this.journalService.clone(sourceId);
        return {id};
    }

    @Post('/merge')
    @Validate(JournalMergeDTO)
    async merge(@Body() dto: JournalMergeDTO): Promise<any> {
        const id = await this.journalService.merge(dto);
        return {id};
    }

    @Put('/:id/change-date')
    async changeDate(@Parameters('id') id: string, @Body('date') date: string): Promise<any> {
        await this.journalService.changeDate(id, date);
        return {id};
    }
}