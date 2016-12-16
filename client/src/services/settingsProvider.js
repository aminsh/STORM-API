let storage = window.localStorage;

export default function settings(){
    "use strict";

    this.$get =()=> storage;
}
