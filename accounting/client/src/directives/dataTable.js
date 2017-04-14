"use strict";

import 'jquery-datatables';


export default function($timeout) {
    return {
        restrict: 'A',
        link(scope, element, attrs){
            let $element = $(element),
                table = $element.DataTable({
                    responsive: true,
                    "scrollY": attrs.height || '500px',
                    paging: false,
                    searching: false,
                    ordering: false,
                    "bInfo": false
                });

            scope.$on('grid-changed', ()=> {
                $timeout(()=> table.DataTable());
            });

            scope.$on('grid-scroll-down', ()=> {
                $('.dataTables_scrollBody').scrollTop(800);

                // $('.dataTables_scrollBody')[0].scrollHeight
            });

        }
    };
}
