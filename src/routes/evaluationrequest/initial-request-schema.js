const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.object()
            .prop('requestCategory', S.array().items(S.string().format('uuid')).description('服务类别ID，数组'))
            .prop('level', S.number().description('申请级别'))
            .prop('requestType', S.string().enum(['初次申请', '级别变更']).description('申请类型'))
            .prop('nature', S.string().maxLength(20).description('企业资质')),
    )
    .required(['data']);

module.exports = {
  description: `
    初次申请
  `,
  body: bodyJsonSchema,
};
