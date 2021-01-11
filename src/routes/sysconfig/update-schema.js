const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('name', S.string().required().description('配置名称'))
    .prop('value', S.string().required().description('配置值'))
    .prop('descStr', S.string().description('配置值'));

module.exports = {
  body: bodyJsonSchema,
};
