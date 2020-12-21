/*
 * @description: 登录接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-12-18 16:27:50
 * @LastEditTime: 2020-12-18 16:31:01
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const bodyJsonSchema = S.object()
    .prop('userName', S.string().required())
    .prop('pwd', S.string().required())
    .prop('type', S.string());

module.exports = {
  body: bodyJsonSchema,
};
