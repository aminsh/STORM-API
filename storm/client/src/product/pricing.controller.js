export default class PricingController {
    constructor($stateParams, $sce, $rootScope) {
        $rootScope.noFooter = true;
        this.pricelist = [
            {
                key: 'free',
                name: 'رایگان',
                cost: '۰',
                features: [
                    'تک کاربره',
                    '30 روزه',
                    'تمامی امکانات'
                ],
                color: 'lime'
            },
            {
                key: 'economy',
                name: 'اقتصادی',
                cost: '50.000 تومان / ماهیانه',
                features: [
                    '2 کاربره',
                    'حسابداری دفترداری',
                    'سیستم خرید و فروش',
                ],
                color: 'green'
            },
            {
                key: 'professional',
                name: 'حرفه ای',
                cost: '200.000 تومان / ماهیانه',
                features: [
                    'تعداد کاربر نامحدود',
                    'تمامی امکانات'
                ],
                color: 'cyan'
            },
            {
                key: 'dedicated',
                name: 'سرور اختصاصی ',
                cost: 'تماس بگیرید',
                features: [
                    'دامین اختصاصی',
                    'کابران نامحدود',
                    'تمامی امکانات',
                ],
                color: 'blue'
            },
        ];
    }
}

PricingController.$inject = ["$stateParams", "$sce","$rootScope"];
