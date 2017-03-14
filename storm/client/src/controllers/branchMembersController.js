export default function branchMembersController(branchApi, logger) {
    "use strict";

    this.members = [];
    this.errors = [];


    this.fetch = ()=>
        branchApi.getMembers().then(result => this.members = result.asEnumerable()
            .select(m=> {
                if (m.state == 'active') {
                    m.icon = 'glyphicon-ok-circle';
                    m.style = {'color': 'green'};
                    m.command = {
                        title: 'Deactivate',
                        icon: 'glyphicon-remove-circle',
                        isDisabled: false
                    }
                }
                if (m.state == 'inactive') {
                    m.icon = 'glyphicon-remove-circle';
                    m.style = {'color': 'red'};
                    m.command = {
                        title: 'Activate',
                        icon: 'glyphicon-ok-circle',
                        isDisabled: false
                    }
                }

                return m;
            }).toArray());

    this.fetch();

    this.changeState = member => {
        debugger;

        member.command.isDisabled = true;

        branchApi.changeStateMember(member.id)
            .then(this.fetch)
            .catch(err => this.errors = err)
            .finally(()=> member.command.isDisabled = false);
    };
}