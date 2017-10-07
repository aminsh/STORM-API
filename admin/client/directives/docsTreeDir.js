"use strict";

export default function DocsTreeDir(){

    return {
        restrict: 'E',
        replace: true,
        scope: { tree: "=soTree" },
        template: `<ol class="so-admin-category-rtl" ></ol>`,
        link: function (scope, element, attrs) {

            let $element = $(element);
            let tree = scope.tree;

            for (let i=0; i<tree.length; i++) {
                let $listItem = $("<li>");
                makeTree(tree[i], $listItem);
                $element.append($listItem[0]);
            }

            function makeTree(parent, $listItem) {

                let $editBtn = $("<span>", {
                    "class": "so-admin-category-edit",
                    "ng-click": `model.editPage(${parent.id})`
                }).html("<i class='mdi mdi-pencil' ></i>");

                let $deleteBtn = $("<span>", {
                    "class": "so-admin-category-delete",
                    "ng-click": `model.deletePage(${parent.id})`
                }).html("<i class='mdi mdi-delete' ></i>");

                $listItem
                    .append(parent.title)
                    .append($editBtn)
                    .append($deleteBtn);

                if (parent.children.length > 0) {

                    let $innerList = $("<ol>");
                    for (let i=0; i<parent.children.length; i++) {
                        let $childListItem = $("<li>");
                        makeTree(parent.children[i], $childListItem);
                        $innerList.append($childListItem);
                    }
                    $listItem
                        .append($innerList);

                }

            }

        }
    };

}