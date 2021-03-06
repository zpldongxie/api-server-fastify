/*
 * @description: 业务字典
 * @author: zpl
 * @Date: 2021-01-02 22:25:09
 * @LastEditTime: 2021-03-04 16:53:13
 * @LastEditors: zpl
 */

exports.departmentTag = {
  '系统管理员': 'admin',
  '申请单位': 'sqdw',
  '评审机构': 'psjg',
  '项目管理员': 'xmgly',
  '审核员': 'shy',
  '公约委员会': 'gywyh',
  '委员会管理员': 'wyhgly',
  '评定决定员': 'pdjdy',
  '网安联': 'wal',
};

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
