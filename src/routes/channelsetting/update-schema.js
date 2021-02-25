const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('title', S.string().maxLength(64).description('标题'))
    .prop('descStr', S.string().description('内容'))
    .prop('pic', S.string().description('图片链接'))
    .prop('video', S.string().description('视频链接'))
    .prop('link', S.string().description('普通链接'))
    .prop(
        'type',
        S.string()
            .enum(['pic', 'url', 'desc', 'video'])
            .default('')
            .description('配置类型'),
    )
    .prop('orderIndex', S.number().default(0).description('排序值'))
    .prop('group', S.string().description('分组'))
    .prop('Channel', S.object().prop('id', S.string().format('uuid')))
    .required(['title']);

module.exports = {
  body: bodyJsonSchema,
};
