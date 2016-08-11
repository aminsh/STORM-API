function detailAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        description: entity.description,
        isActive: entity.isActive
    }

    return viewModel;
}

module.exports = detailAccountAssembler;
