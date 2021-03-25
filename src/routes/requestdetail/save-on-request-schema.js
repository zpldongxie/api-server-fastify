const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.object()
            .prop('companyName', S.string().maxLength(64).description('单位名称'))
            .prop('department', S.string().maxLength(64).description('所属/主管部门'))
            .prop('detailed', S.string().maxLength(200).description('地址'))
            .prop('communication', S.string().maxLength(20).description('电话'))
            .prop('postcode', S.string().maxLength(6).description('邮政邮编'))
            .prop('legalPerson', S.string().maxLength(20).description('法人姓名'))
            .prop('legalPersonTel', S.string().maxLength(15).description('法人电话'))
            .prop('legalPersonMobile', S.string().maxLength(11).description('法人手机'))
            .prop('legalPersonEmail', S.string().maxLength(64).description('法人邮箱'))
            .prop('legalPersonFax', S.string().maxLength(20).description('法人传真'))
            .prop('contact', S.string().maxLength(20).description('资质评定联系人'))
            .prop('contactTel', S.string().maxLength(15).description('资质评定联系人电话'))
            .prop('contactMobile', S.string().maxLength(11).description('资质评定联系人手机'))
            .prop('contactEmail', S.string().maxLength(64).description('资质评定联系人邮箱'))
            .prop('contactFax', S.string().maxLength(20).description('资质评定联系人传真'))
            .prop('registrationNu', S.string().maxLength(64).description('企业注册号'))
            .prop('registeredCapital', S.number().description('注册资本'))
            .prop('established', S.string().description('成立时间'))
            .prop('typeOfEnterprise', S.string().maxLength(64).description('企业类型'))
            .prop('businessScope', S.string().maxLength(100).description('经营范围'))
            .prop('shareholder', S.string().maxLength(200).description('主要股东，数组，以逗号隔开'))
            .prop('ratioOfShareholders', S.string().maxLength(200).description('股东持股比例，数组，与主要股东对应'))
            .prop('percentageOfChinese', S.string().maxLength(10).description('中国公民或组织持股比例'))
            .required([
              'companyName',
              'department',
              'detailed',
              'communication',
              'legalPerson',
              'legalPersonTel',
              'legalPersonMobile',
              'contact',
              'contactTel',
              'contactMobile',
              'registrationNu',
              'registeredCapital',
              'established',
              'typeOfEnterprise',
              'businessScope',
              'shareholder',
              'ratioOfShareholders',
              'percentageOfChinese',
            ]),
    )
    .required(['data']);

module.exports = {
  body: bodyJsonSchema,
};
