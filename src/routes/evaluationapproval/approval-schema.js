const S = require('fluent-schema');
const { linkName } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('EvaluationRequestId', S.string().format('uuid').description('流程ID'))
    .prop('linkName', S.string().enum(Object.values(linkName)).description('当前环节'))
    .prop('handlingOpinions', S.string().enum(['通过', '不通过', '待处理']).default('待处理').description('审批结果'))
    .prop('notes', S.string().description('审批意见'))
    .prop('approvalFiles', S.string().description('审核文档'))
    // .prop('applicantId', S.string().format('uuid').description('申请人'))
    // .prop('executiveId', S.string().format('uuid').description('执行人'))
    .prop('nextAuditorId', S.string().format('uuid').description('下一步审核人'))
    .required(['nextAuditorId']);

module.exports = {
  description: `
  提交流程时，需要明确告知后台当前环节
  创建时系统自动获取当前登录账号做为申请人
  更新时系统自动获取当前登录账号做为执行人
  创建及更新都需要指定下一步审核人
  `,
  body: bodyJsonSchema,
};
