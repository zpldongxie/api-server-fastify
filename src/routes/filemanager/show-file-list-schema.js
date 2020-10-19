const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('currentPath', S.string().description('要查看到相对路径'));

module.exports = {
  body: bodyJsonSchema,
};
