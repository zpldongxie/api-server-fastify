/*
 * @description: 企业会员注册请求数据校验
 * @author: zpl
 * @Date: 2021-01-02 22:47:35
 * @LastEditTime: 2021-01-02 22:51:52
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const { memberStatus } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('corporateName', S.string().description('公司名称'))
    .prop('tel', S.string().description('座机'))
    .prop(
        'email',
        S.string()
            .maxLength(64)
            .format(S.FORMATS.EMAIL)
            .description('邮箱'),
    )
    .prop('contacts', S.string().description('联系人'))
    .prop(
        'contactsMobile',
        S.string()
            .maxLength(11)
            .description('联系人手机'),
    )
    .prop('industry', S.string().description('所属行业'))
    .prop('legalPerson', S.string().description('法人'))
    .prop('website', S.string().description('企业网站'))
    .prop('address', S.string().description('地址'))
    .prop(
        'zipCode',
        S.string()
            .maxLength(6)
            .description('邮编'),
    )
    .prop('intro', S.string().description('公司名称'))
    .required(['corporateName', 'tel', 'email', 'contacts', 'contactsMobile']);

module.exports = {
  body: bodyJsonSchema,
};
