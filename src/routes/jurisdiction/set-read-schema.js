const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('depTag', S.string().description('部门类型名称'))
    .prop('modularId', S.string().format('uuid').description('功能ID'))
    .prop('canRead', S.boolean().description('是否可读'))
    .required(['depTag', 'modularId', 'canRead']);

module.exports = {
  body: bodyJsonSchema,
};
