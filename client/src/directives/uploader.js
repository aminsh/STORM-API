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
            /*$(element).filedrop({
             url: '/upload',
             dragOver: ()=> {
             let $elm = $(element).find('.place_drag');
             $elm.addClass('place_drag_uploader');
             $elm.find('.hover_upload_list').addClass('webfont_file');
             },
             dragLeave: ()=> {
             let $elm = $(element).find('.place_drag');
             $elm.removeClass('place_drag_uploader');
             $elm.find('.hover_upload_list').removeClass('webfont_file');
             $elm.find('.place_drag_text1').show();
             },
             uploadStarted: ()=> {
             let $elm = $(element).find('.place_drag');
             $elm.removeClass('place_drag_uploader');
             $elm.find('.hover_upload_list').removeClass('webfont_file');
             $elm.find('.place_drag_text1').hide();

             $rootScope.blockUi.block();
             scope.$apply();

             scope.before();
             },
             uploadFinished: (i, file, response, time)=> {
             scope.uploaded(response);
             $rootScope.blockUi.unBlock();
             scope.$apply();
             },
             error: (err, file) => {
             $rootScope.blockUi.unBlock();
             scope.$apply();

             switch (err) {
             case 'BrowserNotSupported':
             logger.error('browser does not support HTML5 drag and drop');
             break;
             case 'TooManyFiles':
             // user uploaded more than 'maxfiles'
             break;
             case 'FileTooLarge':
             // program encountered a file whose size is greater than 'maxfilesize'
             // FileTooLarge also has access to the file which was too large
             // use file.name to reference the filename of the culprit file
             break;
             case 'FileTypeNotAllowed':
             // The file type is not in the specified list 'allowedfiletypes'
             break;
             case 'FileExtensionNotAllowed':
             // The file extension is not in the specified list 'allowedfileextensions'
             break;
             default:
             break;
             }
             },
             });*/
        }
    };
}

accModule.directive('devTagUploader', uploader);
