const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组'));

module.exports = {
  body: bodyJsonSchema,
};
