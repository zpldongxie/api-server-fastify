/*
 * @description: 获取培训列表接口参数定义
 * @author: zpl
 * @Date: 2020-07-23 23:15:23
 * @LastEditTime: 2020-08-01 14:13:52
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('channelId', S.string().description('栏目ID'))
    .prop('pageSize', S.number().default(10).description('分页大小，默认为10'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'))
    .prop('search', S.string().description('模糊查询条件'));

module.exports = {
  body: bodyJsonSchema,
  response: {
    '2xx': {
      type: 'object',
      properties: {
        status: {type: 'string', enum: ['ok', 'error']},
        total: {type: 'number'},
        currentTotal: {type: 'number'},
        list: {type: 'array'},
      },
    },
  },
};
