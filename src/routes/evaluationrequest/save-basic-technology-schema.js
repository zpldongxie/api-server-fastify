const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.object()
            .prop(
                'proInfo',
                S.array().items(
                    S.object()
                        .prop('productName', S.string().maxLength(50).description('产品名称'))
                        .prop('descStr', S.string().maxLength(200).description('产品概述'))
                        .prop('features', S.string().maxLength(50).description('功能特点'))
                        .prop('certificationStatus', S.string().maxLength(50).description('认证情况'))
                        .required(['productName', 'descStr', 'features', 'certificationStatus']),
                ),
            )
            .prop(
                'securityTool',
                S.array().items(
                    S.object()
                        .prop('name', S.string().maxLength(50).description('名称'))
                        .prop('descStr', S.string().maxLength(200).description('功能描述'))
                        .prop('version', S.string().maxLength(20).description('版本'))
                        .prop('provider', S.string().maxLength(50).description('提供商'))
                        .required(['name', 'descStr']),
                ),
            )
            .prop(
                'workEnv',
                S.array().items(
                    S.object()
                        .prop('type', S.string().maxLength(20).description('分类'))
                        .prop('model', S.string().maxLength(50).description('型号'))
                        .prop('quantity', S.number().description('数量'))
                        .required(['type', 'model', 'quantity']),
                ),
            )
            .prop(
                'serviceChannels',
                S.array().items(
                    S.object()
                        .prop('type', S.string().maxLength(20).description('类别'))
                        .prop('details', S.string().maxLength(200).description('具体内容'))
                        .required(['type', 'details']),
                ),
            ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
