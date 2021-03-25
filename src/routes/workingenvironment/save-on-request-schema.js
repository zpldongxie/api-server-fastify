const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.array().items(
            S.object()
                .prop('type', S.string().maxLength(20).description('分类'))
                .prop('model', S.string().maxLength(50).description('型号'))
                .prop('quantity', S.number().description('数量'))
                .required(['type', 'model', 'quantity']),
        ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
