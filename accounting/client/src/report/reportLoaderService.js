"use strict";

export default class {
    constructor(promise, $window) {
        this.promise = promise;
        this.$window = $window;
    }

    loadIfNot() {
        return this.promise.create((resolve, reject)=> {
           if(this.$window.hasOwnProperty('Stimulsoft'))
               return resolve();

            $.getScript('/public/js/stimulsoft.all.min.js')
                .then(() => {
                    resolve();
                    this.init();
                });
        });
    }

    init(){
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
            window.digitToWord);

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "dateToWord",
            "dateToWord", "", "",
            String, "", [String], ["Date"], [""],
            window.dateToWord);
    }
}