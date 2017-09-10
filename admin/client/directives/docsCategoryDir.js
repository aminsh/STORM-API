"use strict";

export default function DocsCategoryDir(){

    return {
        restrict: 'E',
        replace: true,
        scope: { category: "=soCategory" },
        template: `<ol class="so-admin-category-rtl" ></ol>`,
        link: function (scope, element, attrs) {

            let category = scope.category;
            let $element = $(element);

            category["root"]
                .forEach(item => {

                    let $listItem = $("<li>");
                    let $editBtn = $("<span>", {
                        "class": "so-admin-category-edit",
                        "ng-click": `model.editPage(${item.id})`
                    }).html("<i class='mdi mdi-pencil' ></i>");
                    let $deleteBtn = $("<span>", {
                        "class": "so-admin-category-delete",
                        "ng-click": `model.deletePage(${item.id})`
                    }).html("<i class='mdi mdi-delete' ></i>");

                    $listItem
                        .append(item.title)
                        .append($editBtn)
                        .append($deleteBtn);

                    if (!category.hasOwnProperty(item.id)){
                        $element
                            .append($listItem);
                        return;
                    }

                    let $innerList = $("<ol>");
                    category[item.id]
                        .forEach(innerItem => {

                            let $innerListItem = $("<li>");
                            let $editBtn = $("<span>", {
                                "class": "so-admin-category-edit",
                                "ng-click": `model.editPage(${innerItem.id})`
                            }).html("<i class='mdi mdi-pencil' ></i>");
                            let $deleteBtn = $("<span>", {
                                "class": "so-admin-category-delete",
                                "ng-click": `model.deletePage(${innerItem.id})`
                            }).html("<i class='mdi mdi-delete' ></i>");

                            $innerListItem
                                .append(innerItem.title)
                                .append($editBtn)
                                .append($deleteBtn);

                            $innerList
                                .append($innerListItem);

                        });

                    $listItem
                        .append($innerList);

                    $element
                        .append($listItem);

                });

        }
    };

}