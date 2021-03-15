const S = require('fluent-schema');
const { departmentTag } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('tag', S.string().enum(Object.values(departmentTag)).description('身份类型'))
    .prop('search', S.string().description('模糊查询条件'))
    .prop('filter', S.object().description('筛选条件'))
    .prop('sorter', S.object().description('排序条件'))
    .required([]);

module.exports = {
  body: bodyJsonSchema,
};
