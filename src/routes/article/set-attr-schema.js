const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组')).required()
    .prop('attr', S.object().description('属性名称')).required();

module.exports = {
  body: bodyJsonSchema,
};
