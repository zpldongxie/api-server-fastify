const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('filter', S.string().description('关键字'));

module.exports = {
  params: bodyJsonSchema,
};
