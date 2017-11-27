"use strict";


/**
 * @param {BranchApi} branchApi
 */
class BranchSettingsController {
    constructor(tabs, branchApi, logger) {

        tabs.setTab("branchSettings");
        this.events = JSON.parse(localStorage.getItem("events"));

        this.branchApi = branchApi;
        this.event = false;
        this.logger = logger;

        this.codemirrorOptions = {
            mode: 'javascript',
            lineWrapping: true,
            lineNumbers: true,
            onLoad: function (_cm) {
                _cm.setOption("mode", 'javascript');
            }
        };

    }

    onEventClick(item) {
        let event = this.settings.events.asEnumerable()
            .singleOrDefault(e => e.module === item.module && e.event === item.event);

        this.event = event || item;
    }

    onBranchChanged(branch) {

        this.branch = branch;

        this.branchApi.getSettings(branch.id)
            .then(result => {
                this.settings = result;
                this.settings.events = this.settings.events || [];
            });
    }

    save() {

        let persistedEvent = this.settings.events.asEnumerable()
            .singleOrDefault(e => e.module === this.event.module && e.event === this.event.event);

        if (persistedEvent)
            persistedEvent.handler = this.event.handler;
        else
            this.settings.events.push(this.event);

        this.branchApi.saveSettings(this.branch.id, this.settings)
            .then(() => this.logger.success());
    }

}

export default BranchSettingsController;