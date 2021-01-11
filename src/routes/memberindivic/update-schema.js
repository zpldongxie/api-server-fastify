const S = require('fluent-schema');
const { memberStatus, idType, sex } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'name',
        S.string()
            .maxLength(64)
            .description('姓名'),
    )
    .prop(
        'idType',
        S.string()
            .enum(Object.values(idType))
            .default(idType.IDCard)
            .description('证件类型'),
    )
    .prop('idNumber', S.string().description('证件号码'))
    .prop(
        'mobile',
        S.string()
            .maxLength(11)
            .description('手机'),
    )
    .prop('email',
        S.string()
            .maxLength(64)
            .format(S.FORMATS.EMAIL)
            .description('邮箱'),
    )
    .prop(
        'enName',
        S.string()
            .maxLength(64)
            .description('英文名'),
    )
    .prop(
        'sex',
        S.string()
            .enum(Object.values(sex))
            .default(sex.man)
            .description('性别'),
    )
    .prop('maritalStatus', S.string().description('婚姻状况'))
    .prop('website', S.string().description('个人网站'))
    .prop('homeAddress', S.string().description('家庭住址'))
    .prop(
        'zipCode',
        S.string()
            .maxLength(6)
            .description('邮编'),
    )
    .prop('profession', S.string().description('职业'))
    .prop(
        'birthday',
        S.string()
            .format(S.FORMATS.DATE)
            .description('生日'),
    )
    .prop('intro', S.string().description('个人介绍'))
    .prop(
        'logonData',
        S.string()
            .format(S.FORMATS.DATE_TIME)
            .description('注册日期'),
    )
    .prop(
        'status',
        S.string()
            .enum(Object.values(memberStatus))
            .default(memberStatus.underReview)
            .description('状态'),
    )
    .prop('rejectDesc', S.string().description('驳回原因'))
    .required(['name', 'mobile', 'email']);

module.exports = {
  body: bodyJsonSchema,
};
