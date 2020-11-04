const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('filePath', S.string().description('文件相对路径'))
    .prop('fileName', S.string().description('文件名'));

module.exports = {
  body: bodyJsonSchema,
};
