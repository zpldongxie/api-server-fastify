/*
 * @description: 审批接口参数
 * @author: zpl
 * @Date: 2021-01-11 16:55:39
 * @LastEditTime: 2021-01-27 14:25:32
 * @LastEditors: zpl
 */
const S = require('fluent-schema');
const { serviceStatus } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'status',
        S.string()
            .enum(Object.values(serviceStatus))
            .default(serviceStatus.underReview)
            .description('状态'),
    )
    .prop('rejectReason', S.string().description('拒绝原因'))
    .required(['id', 'status']);

module.exports = {
  body: bodyJsonSchema,
};
