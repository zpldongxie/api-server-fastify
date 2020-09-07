/*
 * @description: 设置审批状态接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-08-06 22:20:57
 * @LastEditTime: 2020-08-06 22:33:57
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组'))
    .prop('passed', S.boolean().description('是否审批通过'));

module.exports = {
  body: bodyJsonSchema,
};
