/*
 * @description: 获取培训列表接口参数定义
 * @author: zpl
 * @Date: 2020-07-23 23:15:23
 * @LastEditTime: 2020-09-07 17:02:58
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('pageSize', S.number().default(10).description('分页大小，默认为10'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'))
    .prop('search', S.string().description('模糊查询条件'))
    .prop('sorter', S.object().description('排序条件'))
    .prop('TrainingId', S.string().description('培训ID'))
    .prop('name', S.string().description('姓名'))
    .prop('mobile', S.string().description('手机'))
    .prop('email', S.string().description('邮箱'))
    .prop('comp', S.string().description('公司'))
    .prop('passed', S.boolean().description('是否审批通过'));

module.exports = {
  body: bodyJsonSchema,
};
