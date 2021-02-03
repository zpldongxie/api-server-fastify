const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('afterId', S.string().format('uuid'))
    .required(['id', 'afterId']);

module.exports = {
  body: bodyJsonSchema,
};
