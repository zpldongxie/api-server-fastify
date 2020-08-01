/*
 * @description: 查询文章列表接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-07-30 11:31:20
 * @LastEditTime: 2020-08-01 14:02:22
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('channelId', S.number().required().description('栏目ID'))
    .prop('pageSize', S.number().default(20).description('分页大小，默认为10'))
    .prop('current', S.number().default(1).description('当前页码，默认为1'));

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
