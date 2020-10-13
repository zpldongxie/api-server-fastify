/*
 * @description: 查询文章列表接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-07-30 11:31:20
 * @LastEditTime: 2020-10-13 11:06:27
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('channelId', S.number().required().description('栏目ID'))
    .prop('pageSize', S.number().default(20).description('分页大小，默认为20'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'))
    .prop('orderName', S.string().default('conDate').description('排序字段'))
    .prop('orderValue', S.string().default('desc').description('排序方向'));

module.exports = {
  body: bodyJsonSchema,
};
