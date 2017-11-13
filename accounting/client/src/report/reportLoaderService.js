"use strict";

export default class {
    constructor(promise, $window, logger) {
        this.promise = promise;
        this.$window = $window;
        this.logger = logger;
    }

    loadIfNot() {
        return this.promise.create((resolve, reject) => {
            if (this.$window.hasOwnProperty('Stimulsoft'))
                return resolve();

            this.logger.alert({
                title: 'بارگزاری گزارشات',
                text: `<div class="sk-spinner sk-spinner-wave">
                                <div class="sk-rect1"></div>
                                <div class="sk-rect2"></div>
                                <div class="sk-rect3"></div>
                                <div class="sk-rect4"></div>
                                <div class="sk-rect5"></div>
                            </div>`,
                html: true,
                showConfirmButton: false
            });

            $.ajax({
                cache: true,
                url: '/public/js/stimulsoft.all.min.js',
                dataType: 'script'
            }).then(() => {
                resolve();
                this.init();
                this.logger.close();
            });
        });
    }

    init() {
        let Stimulsoft = this.$window.Stimulsoft;

        Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('/public/fa.xml', true);

        let fonts = [
            {"fileName": "BBadr.ttf", "name": "BBadr"},
            {"fileName": "BBaran.ttf", "name": "BBaran"},
            {"fileName": "BBardiya.ttf", "name": "BBardiya"},
            {"fileName": "BCompset.ttf", "name": "BCompset"},
            {"fileName": "BElham.ttf", "name": "BElham"},
            {"fileName": "BKoodakBold.ttf", "name": "BKoodakBold"},
            {"fileName": "BLotus.ttf", "name": "BLotus"},
            {"fileName": "BTraffic.ttf", "name": "BTraffic"},
            {"fileName": "BZar.ttf", "name": "BZar"}
        ];

        fonts.forEach(f => Stimulsoft
            .Base
            .StiFontCollection
            .addOpentypeFontFile(`/public/fonts/${f.fileName}`, f.name));

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "digitToWord",
            "digitToWord", "", "",
            String, "", [Number], ["Amount"], [""],
            num => num.toWord());

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "dateToWord",
            "dateToWord", "", "",
            String, "", [String], ["Date"], [""],
            num => num.toWord());

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "toFloat",
            "toFloat", "", "",
            Number, "", [String], ["Amount"], [""],
            num => parseFloat(num));
    }
}