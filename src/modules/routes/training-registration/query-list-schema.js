/*
 * @description: 获取培训列表接口参数定义
 * @author: zpl
 * @Date: 2020-07-23 23:15:23
 * @LastEditTime: 2020-08-06 23:08:27
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('trainingId', S.string().description('培训ID'))
    .prop('pageSize', S.number().default(10).description('分页大小，默认为10'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'))
    .prop('search', S.string().description('模糊查询条件'))
    .prop('sorter', S.object().description('排序条件'));

module.exports = {
  body: bodyJsonSchema,
};
