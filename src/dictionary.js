/*
 * @description: 业务字典
 * @author: zpl
 * @Date: 2021-01-02 22:25:09
 * @LastEditTime: 2021-02-25 09:42:01
 * @LastEditors: zpl
 */
// 用户状态
exports.userStatus = {
  'applying': '申请中',
  'rejected': '申请驳回',
  'enabled': '启用',
  'disabled': '禁用',
};

// 流程状态
exports.processStatus = {
  'toSubmit': '待提交',
  'pending': '待受理',
  'pendingPayment': '待付款',
  'underReview': '审核中',
  'rejected': '已驳回',
  'passed': '已通过',
};
