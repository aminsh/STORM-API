import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

accModule.config(function (gridFilterCellTypeProvider,
                           detailAccountApiProvider,
                           bankApiProvider) {

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
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.generalLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        },
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
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.subsidiaryLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        },
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

    gridFilterCellTypeProvider.set({
        postingType: postingType,
        balanceType: balanceType,
        activeType: activeType,
        bank: bank,
        generalLedgerAccount: generalLedgerAccount,
        subsidiaryLedgerAccount: subsidiaryLedgerAccount,
        detailAccount: detailAccount,
        chequeCategoryStatus: chequeCategoryStatus,
        journalType: journalType,
        journalStatus: journalStatus
    });
});