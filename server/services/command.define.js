
var commands = [];

function Command(name, actions) {

    this.defaultName = name;

    this.commandName = name;

    this.actions = actions;
}


function defineCommand(name, actions) {
    commands.push(new Command(name, actions));
}

module.exports.define = defineCommand;
module.exports.commands = commands;