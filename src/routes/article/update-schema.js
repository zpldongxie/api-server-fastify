const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('title', S.string())
    .prop('subtitle', S.string())
    .prop('keyWord', S.string())
    .prop('Channels', S.array().items(S.integer()))
    .prop('contentType', S.string())
    .prop('orderIndex', S.number())
    .prop('summary', S.string())
    .prop('thumbnail', S.string())
    .prop('auth', S.string())
    .prop('conDate', S.string())
    .prop('source', S.string())
    .prop('isHead', S.boolean())
    .prop('isRecom', S.boolean())
    .prop('mainCon', S.string());

module.exports = {
  body: bodyJsonSchema,
};
