"use strict";

export function addVariable(options) {
    let variable = new Stimulsoft.Report.Dictionary.StiVariable();

    variable.name = options.name;
    variable.alias = options.alias;
    variable.category = options.category;
    variable.value = options.value;

    return variable;
}

export function viewerConfig() {
    let config = new Stimulsoft.Viewer.StiViewerOptions();

    config.toolbar.fontFamily = "IRANSans";
    config.toolbar.showDesignButton = false
    config.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Pdf;
    config.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

    return config;
}

export function addTranslates(report) {
    let translates = JSON.parse(localStorage.getItem('translate'));

    Object.keys(translates).forEach(key => {
        report.dictionary.variables.add(addVariable({
            name: key,
            alias: key,
            category: "translate",
            value: translates[key]
        }));
    });

}
