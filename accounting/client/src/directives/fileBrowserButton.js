export default function fileBrowserButton(fileService) {
    return {
        restrict: 'E',
        template: `<span class="btn btn-white btn-file">
                    <span class="fileupload-new">{{title}}</span>
                    <!--<span class="fileupload-exists">Change</span>-->
                    <input type="file" id="files" />
                    </span>`,
        scope: {
            title: '@',
            after: '&'
        },
        link: function (scope, element, attrs) {
            scope.title = attrs.title;

            let $file = $(element).children('span').children('#files');

            $file.change(e => fileService.readFile(e).then(data => {
                scope.after({$data: data});
                $file.val(null);
            }));
        }
    };
}