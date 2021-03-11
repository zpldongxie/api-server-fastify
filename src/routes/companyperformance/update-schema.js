const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .required([]);

module.exports = {
  body: bodyJsonSchema,
};
