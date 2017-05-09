import accModule from '../acc.module';

function gridGenerateCommandsService() {
    return generate;
}

function generate(commandOptions) {
    if (!commandOptions) return null;

    commandOptions.asEnumerable()
        .select(c=> typeof cmd == "string" ? c : new KendoGridCommand(c))
        .toArray();
}

class KendoGridCommand {
    constructor(item) {
        this.text = item.title;
        this.imageClass = item.imageClass;
        this.click = this.action;
    }
}

accModule.factory('gridGenerateCommandsService', gridGenerateCommandsService);