const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('typeName', S.string().description('类型名称'));

module.exports = {
  params: bodyJsonSchema,
};
