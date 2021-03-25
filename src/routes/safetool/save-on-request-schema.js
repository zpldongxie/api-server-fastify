const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.array().items(
            S.object()
                .prop('name', S.string().maxLength(50).description('名称'))
                .prop('descStr', S.string().maxLength(200).description('功能描述'))
                .prop('version', S.string().maxLength(20).description('版本'))
                .prop('provider', S.string().maxLength(50).description('提供商'))
                .required(['name', 'descStr']),
        ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
