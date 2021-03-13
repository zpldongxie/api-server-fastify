const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('pageSize', S.number().default(10).description('分页大小，默认为10'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'))
    .prop('search', S.string().description('模糊查询条件'))
    .prop('filter', S.object().description('筛选条件'))
    .prop('sorter', S.object().description('排序条件'))
    .prop('departmentIds', S.array().items(S.string().format('uuid')).description('部门ID'));

module.exports = {
  body: bodyJsonSchema,
};
