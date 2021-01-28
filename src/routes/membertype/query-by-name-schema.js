const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('name', S.string())
    .required(['name']);

module.exports = {
  params: bodyJsonSchema,
};
