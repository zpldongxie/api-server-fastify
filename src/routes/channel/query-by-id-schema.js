const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.anyOf([S.string(), S.number()]))
    .required(['id']);

module.exports = {
  params: bodyJsonSchema,
};
