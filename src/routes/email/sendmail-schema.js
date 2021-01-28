/*
 * @description:
 * @author: zpl
 * @Date: 2021-01-26 11:36:47
 * @LastEditTime: 2021-01-26 17:57:53
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('mailTo', S.string().description('收件邮箱'))
    .prop('subject', S.string().description('主题'))
    .prop('text', S.string().description('邮件内容，文本格式'))
    .prop('html', S.string().description('邮件内容，网页格式'))
    .required(['mailTo', 'subject']);

module.exports = {
  body: bodyJsonSchema,
};
