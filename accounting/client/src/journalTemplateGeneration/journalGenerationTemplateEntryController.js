import _ from 'lodash';

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

class JournalGenerationTemplateEntryController {

    constructor(devConstants,
                journalGenerationTemplateApi,
                $stateParams,
                formService,
                translate,
                logger,
                settingsApi,
                confirmWindowClosing) {

        $scope.$on('$destroy', () => this.confirmWindowClosing.deactivate());

        this.confirmWindowClosing = confirmWindowClosing;
        this.confirmWindowClosing.activate();

        this.journalGenerationTemplateApi = journalGenerationTemplateApi;
        this.formService = formService;
        this.logger = logger;
        this.type = $stateParams.type;

        journalGenerationTemplateApi
            .get(this.type)
            .then(result => {
                this.template = result;

                this.template.data.lines
                    .forEach(e => e.detailAccountEntryType = e.detailAccountEntryType || 'template');

                if (!this.template.fields)
                    this.template.fields = [];


                settingsApi.get().then(result => {

                    this.template.fields = this.template.fields.asEnumerable()
                        .concat(this.canCostAdded
                            ? (result.saleCosts || []).asEnumerable()
                                .select(e => ({display: `${translate('Cost')} ${e.display}`, key: `cost_${e.key}`}))
                                .toArray()
                            : [])

                        .concat(this.canChargeAdded
                            ? (result.saleCharges || []).asEnumerable()
                                .select(e => ({display: `${translate('Charge')} ${e.display}`, key: `charge_${e.key}`}))
                                .toArray()
                            : [])

                        .toArray()
                });
            });

        this.output = false;

        this.urls = {
            getAllAccounts: devConstants.urls.subsidiaryLedgerAccount.all(),
            getAllDetailAccounts: devConstants.urls.detailAccount.all()
        };

        this.popoverHtml = {
            debtor: `<textarea class="form-control" rows="8" ng-model="item.debtor"></textarea>`
        }

    }

    get canCostAdded() {
        return this.type === 'sale';
    }

    get canChargeAdded() {
        return ['sale', 'purchase', 'returnSale'].includes(this.type);
    }

    addLine() {

        this.template.data.lines.push({
            subsidiaryLedgerAccountId: null,
            detailAccountId: null,
            detailAccountEntryType: 'template',
            article: null,
            debtor: "0",
            creditor: "0"
        });
    }

    removeLine(item) {
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

    onChangedDetailAccount(item, row, form) {
        form.detailAccountId.$setViewValue(item.id);
        row.detailAccountId = item.id;
        row.detailAccountCode = item.code;
        row.detailAccountDisplay = item.title;
    }
}

export default JournalGenerationTemplateEntryController;