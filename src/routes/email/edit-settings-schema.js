/*
 * @description:
 * @author: zpl
 * @Date: 2021-01-26 19:02:24
 * @LastEditTime: 2021-01-26 19:08:21
 * @LastEditors: zpl
 */

const S = require('fluent-schema');
const bodyJsonSchema = S.object()
    .prop('host', S.string().description('SMTP服务器'))
    .prop('port', S.string().description('端口号'))
    .prop('user', S.string().description('用户名'))
    .prop('pass', S.string().description('授权码'))
    .prop('from', S.string().description('发件人邮箱地址'))
    .required(['host', 'port', 'user', 'pass', 'from']);

module.exports = {
  body: bodyJsonSchema,
};
