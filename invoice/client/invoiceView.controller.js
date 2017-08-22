"use strict";

export default class InvoiceViewController{

    constructor($window
                ,$rootScope
                ,$scope
                ,$location
                ,$stateParams
                ,saleApi
                ,branchApi
                ,navigate
                ,$filter){

        this.$filter = $filter;
        this.$rootScope = $rootScope;
        this.navigate = navigate;
        this.$window = $window;
        this.$scope = $scope;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.saleApi = saleApi;
        this.branchApi = branchApi;
        this.invoiceId = $stateParams.id;
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

    }

    tHeadInit(){

        this.dataTable.thead = [
            {
                name: "row",
                label: "ردیف",
                sortable: false
            },
            {
                name: "serviceProductName",
                label: "نام کار / خدمات",
                sortable: false
            },
            {
                name: "num",
                label: "تعداد",
                sortable: false
            },
            {
                name: "unitPrice",
                label: "مبلغ واحد",
                sortable: false
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
                sortable: false
            }
        ];

    }
    tBodyInit(){

        this.saleApi
            .getById(this.invoiceId)
            .then((data) => {

                this.invoice = {
                    number: data.number,
                    date: data.date,
                    description: data.description,
                    customerName: data.customerDisplay,
                    status: data.status,
                    statusDisplay: data.statusDisplay,
                    lines: [],
                    sumTotalPrice: this.$filter("number")(data.sumTotalPrice),
                    sumPaidAmount: this.$filter("number")(data.sumPaidAmount),
                    sumRemainder: data.sumRemainder,
                    sumDiscount: 0,
                    sumVat: 0
                };
                for(let i=0; i<data.invoiceLines.length; i++){

                    let thisLine = data.invoiceLines[i],
                        tmp = {
                            row: i+1,
                            serviceProductName: thisLine.description,
                            quantity: thisLine.quantity,
                            unitPrice: this.$filter("number")(thisLine.unitPrice),
                            discount: this.$filter("number")(thisLine.discount),
                            vat: this.$filter("number")(thisLine.vat),
                            totalPrice: null
                        };
                    tmp.totalPrice = (thisLine.unitPrice * thisLine.quantity) - thisLine.discount + thisLine.vat;
                    tmp.totalPrice = this.$filter("number")(tmp.totalPrice);
                    this.invoice.sumVat += thisLine.vat;
                    this.invoice.sumDiscount += thisLine.discount;
                    this.invoice.lines.push(tmp);

                }
                this.invoice.sumVat = this.$filter("number")(this.invoice.sumVat);
                this.invoice.sumDiscount = this.$filter("number")(this.invoice.sumDiscount);
                this.dataTable.tbody = this.invoice.lines;

            })
            .catch(err => console.log(err));

    }

    getPayments(){

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

    printInvoiceContent(){

        this.navigate(
            'print',
            {key: 700},
            {"id": this.invoiceId});

        /*let printWindow = this.$window.open('', 'چاپ فاکتور', 'height=600,width=800');

        printWindow
            .document
            .write(`<html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
                        <title>چاپ فاکتور</title>
                        <link href="/public/css/acc.min.css" rel="stylesheet"/>
                        <link href="/public/css/invoice.min.css" rel="stylesheet" />
                    </head>
                    <body>${content}</body>
                    </html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();*/

        return true;

    }

    currentBranchInit(){

        let currentBranch = this.$rootScope.branch;
        this.branch.logo = currentBranch.logo;
        this.branch.name = currentBranch.name;

    }

}