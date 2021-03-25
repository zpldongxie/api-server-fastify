const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.array().items(
            S.object()
                .prop('productName', S.string().maxLength(50).description('产品名称'))
                .prop('descStr', S.string().maxLength(200).description('产品概述'))
                .prop('features', S.string().maxLength(50).description('功能特点'))
                .prop('certificationStatus', S.string().maxLength(50).description('认证情况'))
                .required(['productName', 'descStr', 'features', 'certificationStatus']),
        ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
