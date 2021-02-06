const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('showStatus', S.string().description('显示状态'));

module.exports = {
  params: bodyJsonSchema,
};
