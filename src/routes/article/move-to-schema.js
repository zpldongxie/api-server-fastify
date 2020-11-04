const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组')).required()
    .prop('cIds', S.array().items(S.number().description('栏目ID数组'))).required();

module.exports = {
  body: bodyJsonSchema,
};
