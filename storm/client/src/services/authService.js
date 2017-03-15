export default function authService() {
    "use strict";

    let user;

    return {
        setUser: id=> user = id,
        isAuth: ()=> (user) ? true : false
    };
}