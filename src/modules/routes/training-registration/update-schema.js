/*
 * @description: 更新接口参数和返回值定义
 * @author: zpl
 * @Date: 2020-07-24 15:14:04
 * @LastEditTime: 2020-08-02 15:27:56
 * @LastEditors: zpl
 */
const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('name', S.string().required().description('姓名'))
    .prop('mobile', S.string().required().description('手机'))
    .prop('email', S.string().required().description('邮箱'))
    .prop('comp', S.string().required().description('公司'))
    .prop('TrainingId', S.string().required().description('关联培训'));

module.exports = {
  body: bodyJsonSchema,
};
