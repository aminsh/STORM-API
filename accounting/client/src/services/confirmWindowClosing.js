class ConfirmWindowClosing {
    constructor($window, translate) {
        this.$window = $window;
        this.translate = translate;
    }

    activate() {
        this.$window.onbeforeunload = () => true;
    }

    deactivate() {
        this.$window.onbeforeunload = false;
    }
}

export default ConfirmWindowClosing;