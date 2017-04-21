export default class PricingController {
    constructor($stateParams, $sce) {
        let products = {
            luca: {
                name: 'نرم‌افزار حسابداری آنلاین لوکا',
                title: 'لوکا',
                logo: '/img/loka.png',
                description: $sce.trustAsHtml("هدف ما در اختیار قرار دادن امکاناتی درخور و شایسته شما با کمترین هزینه می‌باشد. ما می خواهم شما با هر توان مالی در کنار ما براحتی به اهداف مالی خود دست یابید و بتوانید بهترین کاربرد را از اطلاعات خود داشته باشید.<br>اینگونه بودن در کنار هم هنر است."),
                prices: [
                    {
                        name: 'رایگان',
                        cost: '۰',
                        features: [
                            'تک کاربره',
                            'امنیت پایین',
                            'نسخه پشتیبان ندارد',
                            'ماهیانه ۵۰ سند حسابداری'
                        ],
                        color: 'lime'
                    },
                    {
                        name: 'اقتصادی',
                        cost: '50.000 تومان / ماهیانه',
                        features: [
                            '2 کاربره',
                            'امنیت بالاتر نسبت به طرح رایگان',
                            'نسخه پشتبان هر 24 ساعت',
                            'حجم دیتابیس 500 مگابایت'
                        ],
                        color: 'green'
                    },
                    {
                        name: 'حرفه ای',
                        cost: '200.000 تومان / ماهیانه',
                        features: [
                            '5 کاربره',
                            'رمز نگاری از اطلاعات حساس',
                            'نسخه پشتبان هر 12 ساعت ',
                            'حجم دیتابیس 2 گیگابایت'
                        ],
                        color: 'cyan'
                    },
                    {
                        name: 'سرور اختصاصی ',
                        cost: 'تماس بگیرید',
                        features: [
                            'دامین اختصاصی',
                            'کابران نامحدود',
                            'حجم دیتابیس نامحدود',
                            'نسخه پشتبان هر 12 ساعت '
                        ],
                        color: 'blue'
                    },
                ]
            }
        }
        const TYPE = $stateParams.type;
        this.product = products[TYPE]
    }
}

PricingController.$inject = ["$stateParams", "$sce"]
