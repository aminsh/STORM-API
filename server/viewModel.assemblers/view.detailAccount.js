function detailAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: '{0} {1}'.format(entity.code, entity.title),
        title: entity.title,
        description: entity.description,
        isActive: entity.isActive
    }

    return viewModel;
}

module.exports = detailAccountAssembler;
