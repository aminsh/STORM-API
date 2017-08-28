"use strict";

export default class InvoiceViewController {

    constructor($window
        , $rootScope
        , $scope
        , $location
        , $stateParams
        , saleApi
        , branchApi
        , navigate
        , $filter
        , branchThirdPartyApi
        , invoiceApi) {

        this.hasPayPing = false;
        this.showPaymentTable = false;

        branchThirdPartyApi.hasPayPing()
            .then(data => this.hasPayPing = data);

        this.$filter = $filter;
        this.$rootScope = $rootScope;
        this.navigate = navigate;
        this.$window = $window;
        this.$scope = $scope;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.saleApi = saleApi;
        this.branchApi = branchApi;
        this.invoiceApi = invoiceApi;

        this.invoiceId = $stateParams.id;
        this.isRealInvoiceId(this.invoiceId);

        this.invoice = {};
        this.payments = {};
        this.branch = {
            logo: null,
            name: null
        };
        this.dataTable = {
            thead: [],
            tbody: []
        };

        this.tHeadInit();
        this.tBodyInit();
        this.getPayments();
        this.currentBranchInit();
        this.canShowPaymentSection();

    }


    tHeadInit() {
        let formatNumber = this.$filter("number");

        this.dataTable.thead = [
            {
                name: "row",
                label: "ردیف",
                sortable: false
            },
            {
                name: "description",
                label: "نام کالا / خدمات",
                sortable: false
            },
            {
                name: "quantity",
                label: "تعداد",
                sortable: false
            },
            {
                name: "unitPrice",
                label: "مبلغ واحد",
                sortable: false,
                format: item => `<span>${formatNumber(item.unitPrice)}</span>`
            },
            {
                name: "discount",
                label: "تخفیف",
                sortable: false
            },
            {
                name: "vat",
                label: "مالیات",
                sortable: false
            },
            {
                name: "totalPrice",
                label: "مبلغ کل",
                sortable: false,
                format: item => `<span>${formatNumber((item.unitPrice * item.quantity) - item.discount + item.vat)}</span>`
            }
        ];

    }

    tBodyInit() {

        this.saleApi
            .getById(this.invoiceId)
            .then((data) => {
                this.invoice = data;
                this.dataTable.tbody = data.invoiceLines;

            })
            .catch(err => console.log(err));

    }

    getPayments() {

        this.saleApi
            .payments(this.invoiceId)
            .then((data) => {

                this.payments = {
                    amount: data.amount,
                    date: data.date,
                    number: data.number
                };

            })
            .catch(err => console.log(err));

    }

    printInvoiceContent() {

        this.navigate(
            'print',
            {key: 700},
            {"id": this.invoiceId});

        return true;

    }

    currentBranchInit() {

        let currentBranch = this.$rootScope.branch;
        this.branch.logo = currentBranch.logo;
        this.branch.name = currentBranch.name;

    }

    goToPayment() {
        let url = `/invoice/${this.invoiceId}/pay/payping`;
        this.$window.open(url, '_self');
    }

    isRealInvoiceId(id) {

        this.invoiceApi.check(id)
            .then((data) => {
                if (!data.returnValue) this.$window.location = "/404";
            })
            .catch((err) => this.$window.location = "/404")

    }

    canShowPaymentSection() {
        const invoice = this.invoice;

        if (invoice.status === 'paid')
            return false;

        if (invoice.sumRemainder === 0)
            return false;

        if (!this.hasPayPing)
            return false;

        return true;
    }

    canShowPaymentTable() {
        return this.invoice.sumPaidAmount !== 0;
    }

}