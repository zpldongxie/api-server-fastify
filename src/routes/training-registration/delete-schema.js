/*
 * @description: 删除培训报名接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-08-06 22:20:57
 * @LastEditTime: 2020-08-09 16:36:36
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('ids', S.array().items(S.string().format('uuid')).description('id数组'));

module.exports = {
  body: bodyJsonSchema,
};
