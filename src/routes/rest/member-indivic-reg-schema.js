/*
 * @description: 个人会员注册请求数据校验
 * @author: zpl
 * @Date: 2021-01-02 22:47:35
 * @LastEditTime: 2021-01-03 09:42:14
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const { idType } = require('../../dictionary');

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
    .prop('sex', S.string().description('性别'))
    .prop('website', S.string().description('个人网站'))
    .prop('profession', S.string().description('职业'))
    .prop('intro', S.string().description('个人介绍'))
    .required(['name', 'idType', 'mobile', 'email']);

module.exports = {
  body: bodyJsonSchema,
};
