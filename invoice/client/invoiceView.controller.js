"use strict";

export default class InvoiceViewController{

    constructor($window, $scope, $location, $stateParams, saleApi, branchApi){

        this.$window = $window;
        this.$scope = $scope;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.saleApi = saleApi;
        this.branchApi = branchApi;
        this.invoiceId = $stateParams.id;
        this.invoice = {};
        this.payments = {};
        this.branchLogo = null;
        this.dataTable = {
            thead: [],
            tbody: []
        };

        this.tHeadInit();
        this.tBodyInit();
        this.getPayments();
        this.getBranchLogoByInvoiceId();

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
                    sumTotalPrice: data.sumTotalPrice,
                    sumPaidAmount: data.sumPaidAmount,
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
                            unitPrice: thisLine.unitPrice,
                            discount: thisLine.discount,
                            vat: thisLine.vat,
                            totalPrice: null
                        };
                    tmp.totalPrice = (tmp.unitPrice * tmp.quantity) - tmp.discount + tmp.vat;
                    this.invoice.sumVat += tmp.vat;
                    this.invoice.sumDiscount += tmp.discount;
                    this.invoice.lines.push(tmp);

                }
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

    getBranchLogoByInvoiceId(){

        this.branchApi
            .getBranchByInvoiceId(this.invoiceId)
            .then((data) => {

                this.branchLogo = data.returnValue;

            })
            .catch(err => console.log(err));

    }

    printInvoiceContent(content){

        let printWindow = this.$window.open('', 'چاپ فاکتور', 'height=600,width=800');

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
        printWindow.close();

        return true;

    }

}