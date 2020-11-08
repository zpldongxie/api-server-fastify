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
    .prop('mainCon', S.string())
    .prop('ArticleExtensions', S.array().items(
        S.object()
            .prop('id')
            .prop('title').description('��չ����')
            .prop('info').description('��չ����')
            .prop('maket').description('��ע'),
    ).description('��չ��Ϣ'));

module.exports = {
  body: bodyJsonSchema,
};
