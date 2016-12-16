import $ from 'jquery';
import 'jquery.filedrop';

export default function devTagUploader($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/uploader.html',
        replace: true,
        scope: {
            before: '&',
            uploaded: '&'
        },
        link: (scope, element, attrs) => {
            scope.state = 'none';

            $(element).filedrop({
                url: '/upload',
                dragOver: ()=> {
                    let $elm = $(element).find('.place_drag');
                    $elm.addClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').addClass('webfont_file');

                    scope.state = 'dragging';
                    scope.$apply();
                },
                dragLeave: ()=> {
                    let $elm = $(element).find('.place_drag');
                    $elm.removeClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').removeClass('webfont_file');
                    //$elm.find('.place_drag_text1').show();

                    scope.state = 'none';
                    scope.$apply();
                },
                uploadStarted: ()=> {
                    let $elm = $(element).find('.place_drag');
                    $elm.removeClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').removeClass('webfont_file');
                    $elm.find('.place_drag_text1').hide();

                    scope.state = 'uploading';
                    scope.$apply();
                    scope.before();
                },
                uploadFinished: (i, file, response, time)=> {
                    scope.uploaded({response: response});
                    scope.state = 'none';
                    scope.$apply();
                },
                error: (err, file) => {
                    scope.state = 'none';
                    scope.$apply();

                    switch (err) {
                        case 'BrowserNotSupported':
                            //logger.error('browser does not support HTML5 drag and drop');
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
                }
            });
        }
    };
}

