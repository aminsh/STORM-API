"use strict";

import 'jquery-datatables';


export default function ($timeout) {
    return {
        restrict: 'A',
        link(scope, element, attrs){
            let $element = $(element);

            $element.DataTable({
                responsive: true,
                "scrollY": attrs.height || '500px',
                paging: false,
                searching: false,
                ordering: false,
                "bInfo": false
            });

            scope.$on('grid-changed', () => {
                $timeout(() => $element.DataTable());
            });

            scope.$on('grid-scroll-to-row', (e, args) => {
                $element.find('.dataTables_scrollBody').animate({
                    scrollTop: $element.find(`#${args.id}`).offset().top
                }, 2000);
            });
        }
    };
}
