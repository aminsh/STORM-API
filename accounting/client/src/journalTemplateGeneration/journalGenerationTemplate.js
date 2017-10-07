

class JournalGenerationTemplateController {

    constructor(devConstants, $state, ) {

        this.$state = $state;

        this.journalGenerationTemplateSourceType = devConstants.enums.JournalGenerationTemplateSourceType().data;
    }

    create(){
        this.$state.go('.create');
    }

    onChanged(item){
        this.$state.go('.edit', {id: item.id});
    }

}

export default JournalGenerationTemplateController;