import accModule from '../acc.module';
//import $ from 'jquery';
//import 'jquery.filedrop';

import Dropzone from 'dropzone';

function uploader() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/uploader.html',
        replace: true,
        scope: {
            before: '&',
            uploaded: '&'
        },
        link: (scope, element, attrs) => {
            let config = {
                    url: '/upload',
                    method: 'post',
                    maxFilesize: 2,
                    clickable: '#upload',

                },
                dropzone = new Dropzone(element[0], config);

            dropzone.on('success', function (file, response) {
                scope.uploaded({fileName: response.fullName});
                scope.$apply();
            });

            dropzone.on('error', function (error) {
                console.log(error);
            });
        }
    };
}

accModule.directive('devTagUploader', uploader);
