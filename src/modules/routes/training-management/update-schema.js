/*
 * @description: 更新接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-07-24 15:14:04
 * @LastEditTime: 2020-07-28 20:11:03
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('title', S.string().required().description('培训标题'))
    .prop('subTitle', S.string().description('培训副标题'))
    .prop('registStartTime', S.string().format(S.FORMATS.DATE).required().description('报名开始时间'))
    .prop('registEndTime', S.string().format(S.FORMATS.DATE).required().description('报名截止时间'))
    .prop('trainingMethod', S.string().required().description('培训方式，例如线上公开'))
    .prop('startTime', S.string().format(S.FORMATS.DATE_TIME).required().description('培训开始时间'))
    .prop('endTime', S.string().format(S.FORMATS.DATE_TIME).required().description('培训结束时间'))
    .prop('desc', S.string().description('培训介绍'))
    .prop('ChannelId', S.number().required().description('培训类型，与栏目配置关联'));

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
