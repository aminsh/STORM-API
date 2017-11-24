"use strict";


/**
 * @param {BranchApi} branchApi
 */
class BranchSettingsController {
    constructor(tabs, branchApi) {

        tabs.setTab("branchSettings");

        this.branchApi = branchApi;
        this.code = `function (invoice) {\\n this.runService(\\"journalCreate\\", invoice);\\n console.log(\\"code is fine\\");\\n}`;

        this.codemirrorOptions = {
            mode: 'javascript',
            lineWrapping: true,
            lineNumbers: true,
            onLoad: function (_cm) {
                _cm.setOption("mode", 'javascript');
            }
        };

    }

    onBranchChanged(branchId) {
        this.branchApi.getSettings(branchId)
            .then(result => this.settings = result);
    }

}

export default BranchSettingsController;