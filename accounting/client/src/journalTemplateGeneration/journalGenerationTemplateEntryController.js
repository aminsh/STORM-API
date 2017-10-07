import _ from 'lodash';

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

class JournalGenerationTemplateEntryController {

    constructor(devConstants,
                journalGenerationTemplateApi,
                $stateParams,
                formService,
                logger) {

        this.journalGenerationTemplateApi = journalGenerationTemplateApi;
        this.formService = formService;
        this.logger = logger;
        this.type = $stateParams.type;

        journalGenerationTemplateApi
            .get(this.type)
            .then(result => {
                this.template = result;
                if (!this.template.fields)
                    this.template.fields = [];
            });

        this.output = false;

        this.urls = {
            getAllAccounts: devConstants.urls.subsidiaryLedgerAccount.all(),
            getAllDetailAccounts: devConstants.urls.detailAccount.allBySubsidiaryLedgerAccount()
        };

    }

    addLine() {

        this.template.data.lines.push({
            subsidiaryLedgerAccountId: null,
            detailAccountId: null,
            article: null,
            debtor: "0",
            creditor: "0"
        });
    }

    removeLine(item){
        this.template.data.lines.asEnumerable().remove(item);
    }

    save(form) {
        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            return;
        }

        this.errors = [];
        this.isSaving = true;

        this.journalGenerationTemplateApi.save(this.type, this.template)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    get testModel() {
        return this.template.fields.asEnumerable().toObject(item => item.key, item => item.value);
    }

    test(form) {

        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            return;
        }

        this.output = {};

        let data = this.template.data;

        this.output.description = this.render(data.description);

        this.output.lines = data.lines.asEnumerable()
            .select(item => ({
                subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                subsidiaryLedgerAccountCode: item.subsidiaryLedgerAccountCode,
                detailAccountId: this.render(item.detailAccountId),
                article: this.render(item.article),
                debtor: parseInt(this.render(item.debtor)),
                creditor: parseInt(this.render(item.creditor))
            }))
            .toArray();
    }

    render(template) {
        return _.template(template)(this.testModel);
    }

    onChangedSubsidiaryLedgerAccount(item, row, form) {
        form.subsidiaryLedgerAccountId.$setViewValue(item.id);
        row.subsidiaryLedgerAccountId = item.id;
        row.subsidiaryLedgerAccountCode = item.code;
        row.subsidiaryLedgerAccountDisplay = item.title;
    }
}

export default JournalGenerationTemplateEntryController;