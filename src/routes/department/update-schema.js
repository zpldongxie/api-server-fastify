const S = require('fluent-schema');
const { departmentTag } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('name', S.string().description('部门名称'))
    .prop('tag', S.string().enum(Object.values(departmentTag)).description('部门类型'))
    .required([]);

module.exports = {
  description: `
    名称应以单位全称命名，前台页面需要给现提示，
    选择好部门类型后，后台会根据类型及名称自动计算父级部门
  `,
  body: bodyJsonSchema,
};
