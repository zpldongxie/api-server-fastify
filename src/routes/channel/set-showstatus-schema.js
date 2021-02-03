const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('showStatus', S.string())
    .required(['id', 'showStatus']);

module.exports = {
  body: bodyJsonSchema,
};
