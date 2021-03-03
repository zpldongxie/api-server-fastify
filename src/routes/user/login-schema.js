/*
 * @description: 登录接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-07-26 13:37:33
 * @LastEditTime: 2021-03-01 16:36:53
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const bodyJsonSchema = S.object()
    .prop('userName', S.string().required())
    .prop('pwd', S.string().required())
    .prop('type', S.string())
    .prop('autoLogin', S.boolean());

module.exports = {
  body: bodyJsonSchema,
};
