const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .required(['id']);

module.exports = {
  params: bodyJsonSchema,
};
