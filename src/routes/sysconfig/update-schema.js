const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'));

module.exports = {
  body: bodyJsonSchema,
};
