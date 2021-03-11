const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组'))
    .required(['ids']);

module.exports = {
  body: bodyJsonSchema,
};
