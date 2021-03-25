const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.array().items(
            S.object()
                .prop('type', S.string().maxLength(20).description('类别'))
                .prop('details', S.string().maxLength(200).description('具体内容'))
                .required(['type', 'details']),
        ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
