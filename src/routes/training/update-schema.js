const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('title', S.string().description('培训标题'))
    .prop('subTitle', S.string().default('').description('培训副标题'))
    .prop('registStartTime', S.string().format(S.FORMATS.DATE_TIME).description('报名开始时间'))
    .prop('registEndTime', S.string().format(S.FORMATS.DATE_TIME).description('报名截止时间'))
    .prop('trainingMethod', S.string().description('培训方式，例如线上公开'))
    .prop('startTime', S.string().format(S.FORMATS.DATE_TIME).description('培训开始时间'))
    .prop('endTime', S.string().format(S.FORMATS.DATE_TIME).description('培训结束时间'))
    .prop('desc', S.string().default('').description('培训介绍'))
    .prop('ChannelId', S.string().format('uuid').description('培训类型，与栏目配置关联'))
    .required(['title', 'registStartTime', 'registEndTime', 'trainingMethod', 'startTime', 'endTime', 'ChannelId']);

module.exports = {
  body: bodyJsonSchema,
};
