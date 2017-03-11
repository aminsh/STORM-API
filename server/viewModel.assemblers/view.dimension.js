function dimensionAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        isActive: entity.isActive,
        dimensionCategoryId: entity.dimensionCategoryId
    };

    return viewModel;
}

module.exports = dimensionAssembler;