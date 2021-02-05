const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('afterId', S.string().format('uuid'))
    .prop('sorterMode', S.string().enum(['排序模式', '嵌套模式']))
    .required(['id', 'afterId']);

module.exports = {
  body: bodyJsonSchema,
};
