/*
 * @description: 创建用务申请
 * @author: zpl
 * @Date: 2021-01-03 15:36:57
 * @LastEditTime: 2021-02-07 14:48:52
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const { demandType } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('corporateName', S.string().description('公司名称'))
    .prop('tel', S.string().description('座机'))
    .prop(
        'email',
        S.string()
            .maxLength(64)
            .format(S.FORMATS.EMAIL)
            .description('邮箱'),
    )
    .prop('address', S.string().description('地址'))
    .prop(
        'zipCode',
        S.string()
            .maxLength(6)
            .description('邮编'),
    )
    .prop('website', S.string().description('单位网站'))
    .prop('contacts', S.string().description('联系人'))
    .prop(
        'contactsMobile',
        S.string()
            .maxLength(11)
            .description('联系人手机'),
    )
    .prop(
        'demandType',
        S.string()
            .enum(Object.values(demandType))
            .description('需求类型'),
    )
    .prop('requestDesc', S.string().description('需求描述'))
    .required(['corporateName', 'tel', 'email', 'contacts', 'contactsMobile', 'demandType', 'requestDesc']);

module.exports = {
  body: bodyJsonSchema,
};

