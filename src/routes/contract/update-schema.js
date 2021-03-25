const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('EvaluationRequestId', S.string().format('uuid').description('流程ID'))
    .prop('name', S.string().maxLength(64).description('合同名称'))
    .prop('number', S.string().maxLength(64).description('合同编号'))
    .prop('amount', S.number().description('合同额'))
    .prop('dateOfSigning', S.string().description('签署日期'))
    .prop('archive', S.string().description('归档文件'))
    .prop('descStr', S.string().description('描述'))
    .required(['EvaluationRequestId', 'name', 'number', 'amount', 'dateOfSigning', 'archive']);

module.exports = {
  body: bodyJsonSchema,
};
