export default function branchStateService(){
    "use strict";

    let branch = false;

    return {
        set: b => branch = b,
        get: ()=> branch
    };
}