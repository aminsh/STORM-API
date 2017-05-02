export default class HomeController {
    constructor($window) {
        let translate = {
            title: 'نرم‌افزار حسابداری آنلاین استورم'
        };
        this.prices = [
            {
                name: 'رایگان',
                cost: '۰ هزار تومان',
                features: [
                    'تک کاربره',
                    'امنیت پایین',
                    'نسخه پشتیبان ندارد',
                    'حد اکثر 1000 سند حسابداری'
                ]
            },
            {
                name: 'اقتصادی',
                cost: '50.000 تومان (ماهیانه)',
                features: [
                    '2 کاربره',
                    'امنیت بالاتر نسبت به طرح رایگان',
                    'نسخه پشتبان هر 24 ساعت',
                    'حجم دیتابیس 500 مگابایت'
                ]
            },
            {
                name: 'حرفه ای',
                cost: '200.000 تومان (ماهیانه)',
                features: [
                    '5 کاربره',
                    'رمز نگاری از اطلاعات حساس',
                    'نسخه پشتبان هر 12 ساعت ',
                    'حجم دیتابیس 2 گیگابایت'
                ]
            },
            {
                name: 'سرور اختصاصی ',
                cost: 'تماس بگیرید',
                features: [
                    'دامین اختصاصی',
                    'کابران نامحدود',
                    'حجم دیتابیس نامحدود',
                    'نسخه پشتبان هر 12 ساعت '
                ]
            },
        ];
        this.$window = $window;
    }

    goToStorm(){
        this.$window.href = this.$window.origin + '/acc';
    }
}

HomeController.inject = ['$window'];
