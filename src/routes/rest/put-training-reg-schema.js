/*
 * @description: 培训报名接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-08-06 10:52:43
 * @LastEditTime: 2020-08-06 10:54:20
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('name', S.string().required().description('姓名'))
    .prop('mobile', S.string().required().description('手机'))
    .prop('email', S.string().required().description('邮箱'))
    .prop('comp', S.string().required().description('公司'))
    .prop('TrainingId', S.string().required().description('关联培训'));

module.exports = {
  body: bodyJsonSchema,
};
