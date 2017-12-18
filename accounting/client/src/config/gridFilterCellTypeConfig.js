import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

accModule.config(function (gridFilterCellTypeProvider,
                           detailAccountApiProvider,
                           bankApiProvider,
                           generalLedgerAccountApiProvider,
                           subsidiaryLedgerAccountApiProvider) {

    let postingType = {
        data: devConstants.enums.AccountPostingType().data,
        template: `<li ng-repeat="item in items">
                <dev-tag-radio
                        ng-class="{'checked': item.key == filter.value}"
                        ng-model="filter.value"
                        k-value="{{item.key}}"></dev-tag-radio>
                        {{item.display}}
            </li>`
    };

    let balanceType = {
        data: devConstants.enums.AccountBalanceType().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let groupingType = {
        data: devConstants.enums.AccountGroupingType().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let activeType = {
        data: devConstants.enums.Active().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let journalType = {
        data: devConstants.enums.JournalType().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let journalStatus = {
        data: devConstants.enums.JournalStatus().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let chequeCategoryStatus = {
        data: devConstants.enums.ChequeCategoryStatus().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let generalLedgerAccount = {
        dataSource: generalLedgerAccountApiProvider.$get().getAll,
        template: `<li>
               <dev-tag-combo-box
               k-placeholder="{{'Select' | translate}}"
               k-data-text-field="display"
               k-data-value-field="id"
               k-data-source="dataSource"
               ng-model="filter.value"></dev-tag-combo-box>
            </li>`,
        style: {width: '300px'}
    };

    let subsidiaryLedgerAccount = {
        dataSource: subsidiaryLedgerAccountApiProvider.$get().getAll,
        template: `<li>
               <dev-tag-combo-box
               k-placeholder="{{'Select' | translate}}"
               k-data-text-field="display"
               k-data-value-field="id"
               k-data-source="dataSource"
               ng-model="filter.value"></dev-tag-combo-box>
            </li>`,
        style: {width: '300px'}
    };

    let detailAccount = {
        dataSource: detailAccountApiProvider.$get().getAll,
        template: `<li>
               <dev-tag-combo-box
               k-placeholder="{{'Select' | translate}}"
               k-data-text-field="display"
               k-data-value-field="id"
               k-data-source="dataSource"
               ng-model="filter.value"></dev-tag-combo-box>
            </li>`,
        style: {width: '300px'}
    };

    let bank = {
        dataSource: bankApiProvider.$get().getAll,
        template: `<li>
               <dev-tag-combo-box
               k-placeholder="{{'Select' | translate}}"
               k-data-text-field="title"
               k-data-value-field="id"
               k-data-source="dataSource"
               ng-model="filter.value"></dev-tag-combo-box>
            </li>`

    };

    let person = {
        template: `<li>
               <dev-tag-combo-box
               k-placeholder="{{'Select' | translate}}"
               k-data-text-field="title"
               k-data-value-field="id"
               url="${devConstants.urls.people.getAll()}"
               ng-model="filter.value"></dev-tag-combo-box>
            </li>`,
        style: {width: '300px'}
    };

    let invoiceStatus = {
        data: devConstants.enums.InvoiceStatus().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let productType = {
        data: devConstants.enums.ProductType().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let detailAccountType = {
        data: devConstants.enums.DetailAccountType().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    let chequeStatus = {
        data: devConstants.enums.ChequeStatus().data,
        template: `<li ng-repeat="item in items">
        <dev-tag-radio 
            ng-class="{'checked': item.key == filter.value}"
            ng-model="filter.value" 
            k-value="{{item.key}}"></dev-tag-radio>
        {{item.display}}
        </li>`
    };

    gridFilterCellTypeProvider.set({
        postingType: postingType,
        groupingType: groupingType,
        balanceType: balanceType,
        activeType: activeType,
        detailAccountType: detailAccountType,
        bank: bank,
        generalLedgerAccount: generalLedgerAccount,
        subsidiaryLedgerAccount: subsidiaryLedgerAccount,
        detailAccount: detailAccount,
        chequeCategoryStatus: chequeCategoryStatus,
        journalType: journalType,
        journalStatus: journalStatus,
        person,
        invoiceStatus,
        productType,
        chequeStatus
    });
});