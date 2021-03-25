const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.object()
            .prop('programsNum', S.number().description('完成安全服务项目数'))
            .prop('totalAmount', S.number().description('合同金额合计'))
            .prop('sameProgramsNum', S.number().description('完成与申报类别一致的服务项目数'))
            .prop('sameAmount', S.number().description('完成与申报类别一致的服务项目数'))
            .prop('sameSingleProgramNum', S.number().description('与申报类别一致的单个服务项目数'))
            .required([
              'programsNum',
              'totalAmount',
              'sameProgramsNum',
              'sameAmount',
              'sameSingleProgramNum',
            ]),
    )
    .required(['data']);

module.exports = {
  body: bodyJsonSchema,
};
