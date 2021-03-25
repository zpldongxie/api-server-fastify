const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.object()
            .prop('totalCo', S.number().description('企业总人数'))
            .prop('leaderAgeLimit', S.number().description('负责人从事信息技术管理年限'))
            .prop('techLeaderName', S.string().maxLength(20).description('技术负责人姓名'))
            .prop('techLeaderMajor', S.string().maxLength(20).description('技术负责人专业'))
            .prop('techLeaderTitle', S.string().maxLength(20).description('技术负责人职称'))
            .prop('techLeaderAgeLimit', S.number().description('技术负责人从事信息技术工作年限'))
            .prop('financeLeaderName', S.string().maxLength(20).description('财务负责人姓名'))
            .prop('financeLeaderMajor', S.string().maxLength(20).description('财务负责人专业'))
            .prop('financeLeaderTitleAges', S.string().description('财务负责人获得职称时间'))
            .prop('totalSecurity', S.number().description('安全服务人员总人数'))
            .prop('undergraduateNum', S.number().description('安全服务人员本科学历人数'))
            .prop('undergraduateShare', S.string().maxLength(10).description('安全服务人员本科占专业技术人员比例'))
            .prop('masterNum', S.number().description('安全服务人员硕士学历人数'))
            .prop('masterShare', S.string().maxLength(10).description('安全服务人员硕士占专业技术人员比例'))
            .prop('doctorNum', S.number().description('安全服务人员博士学历及以上人数'))
            .prop('doctorShare', S.string().maxLength(10).description('安全服务人员博士学历及以上占专业技术人员比例'))
            .prop('technicianNum', S.number().description('网络安全专业技术员人数'))
            .required([
              'totalCo',
              'leaderAgeLimit',
              'techLeaderName',
              'techLeaderMajor',
              'techLeaderTitle',
              'techLeaderAgeLimit',
              'financeLeaderName',
              'financeLeaderMajor',
              'financeLeaderTitleAges',
              'totalSecurity',
              'undergraduateNum',
              'undergraduateShare',
              'masterNum',
              'masterShare',
              'doctorNum',
              'doctorShare',
              'technicianNum',
            ]),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
