const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('requestLevel', S.number().description('申请级别'))
    .required(['requestLevel']);

module.exports = {
  description: `提交评定申请时，根据当前用户所处的地区，自动获取到可选择的所有审批单位项目管理员以供选择。`,
  body: bodyJsonSchema,
};
