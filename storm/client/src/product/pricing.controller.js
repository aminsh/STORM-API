export default class PricingController {
    constructor($stateParams, $sce, $rootScope) {
        $rootScope.noFooter = true;
        this.pricelist = [
            {
                key: 'economy',
                name: 'اقتصادی',
                cost: '50.000 تومان / ماهیانه',
                features: [
                    '2 کاربره',
                    'دامنه اختصاصی ندارد',
                    'پشتیبانی مالی ندارد',
                ],
                suggest:false,
                color: 'green'
            },
            {
                key: 'professional',
                name: 'حرفه ای',
                cost: '200.000 تومان / ماهیانه',
                features: [
                    'تعداد کاربر نامحدود',
                    'دامنه اختصاصی ندارد',
                    'پشتیبانی مالی دارد'
                ],
                suggest:true,
                color: 'cyan'
            },
            {
                key: 'dedicated',
                name: 'سرور اختصاصی ',
                cost: 'تماس بگیرید',
                features: [
                    'دامنه اختصاصی',
                    'کابران نامحدود',
                    'پشتیبانی مالی دارد'
                ],
                suggest:false,
                color: 'blue'
            },
        ];
    }
}

PricingController.$inject = ["$stateParams", "$sce","$rootScope"];
