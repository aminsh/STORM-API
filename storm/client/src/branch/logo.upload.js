"use strict";

import Dropzone from 'dropzone';

export default function uploader() {
    return {
        restrict: 'E',
        template: `<form action="#" class="dropzone dz-clickable" id="upload">

    <div class="dz-default dz-message"><span>
        <strong>برای آپلود لوگو فایل خود را به این قسمت بکشید یا همینجا کلیک کنید</strong>
    </span>
    </div>
</form>`,
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
                    clickable: '#upload'

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