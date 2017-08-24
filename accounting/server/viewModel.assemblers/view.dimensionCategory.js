
function dimensionCategoryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        title: entity.title
    };

    return viewModel;
}

module.exports = dimensionCategoryAssembler;