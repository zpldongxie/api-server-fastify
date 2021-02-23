const S = require('fluent-schema');

const { entryStatus } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('corporateName', S.string().description('单位名称'))
    .prop('tel', S.string().description('座机'))
    .prop('email', S.string().description('邮箱'))
    .prop('address', S.string().description('地址'))
    .prop('zipCode', S.string().description('邮编'))
    .prop('website', S.string().description('单位网站'))
    .prop('contacts', S.string().description('联系人'))
    .prop('contactsMobile', S.string().description('联系人手机'))
    .prop('type', S.string().enum(['厂商', '产品']).description('申请类别'))
    .prop('descStr', S.string().description('申请描述'))
    .prop('status', S.string().enum(Object.values(entryStatus)).description('状态'))
    .prop('rejectDesc', S.string().description('驳回原因'))
    .prop('Channels', S.array().items(S.object().prop('id', S.string().format('uuid'))))
    .required(['corporateName', 'tel', 'email', 'contacts', 'contactsMobile', 'type', 'descStr', 'Channels']);

module.exports = {
  body: bodyJsonSchema,
};
