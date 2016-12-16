export default function ($rootScope, authService, navigate) {
    "use strict";

    $rootScope.$on('$routeChangeStart', (e, next, current) => {
            let isAuthRequired = next.$$route.data.requireAuth;

            if (!isAuthRequired)
                return;

            if (authService.isAuth())
                return;

            e.preventDefault();
            navigate('login', null, {returnUrl: next.$$route.originalPath});
        }
    );
}