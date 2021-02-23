const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('settingExtend', S.boolean().description('是否继承全局配置'))
    .required(['id', 'settingExtend']);

module.exports = {
  body: bodyJsonSchema,
};
