const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.anyOf([S.string(), S.number()])).description('id数组'));

module.exports = {
  body: bodyJsonSchema,
};
