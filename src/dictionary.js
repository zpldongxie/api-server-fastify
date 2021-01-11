/*
 * @description: 业务字典
 * @author: zpl
 * @Date: 2021-01-02 22:25:09
 * @LastEditTime: 2021-01-11 16:38:39
 * @LastEditors: zpl
 */
// 审核状态
exports.memberStatus = {
  'applying': '申请中',
  'firstPass': '初审通过',
  'formalMember': '正式会员',
  'reject': '申请驳回',
  'disable': '禁用',
};

// 服务需求类型
exports.demandType = {
  'schemeConsultation': '方案咨询',
  'schemeDemonstration': '方案论证',
  'schemeDesign': '方案设计',
  'safetyAssessment': '安全评估',
};

// 服务状态
exports.serviceStatus = {
  'underReview': '申请中',
  'accept': '接受申请',
  'reject': '拒绝申请',
  'inService': '服务中',
  'finished': '服务完成',
};

// 证件类型
exports.idType = {
  'IDCard': '身份证',
};

// 性别
exports.sex = {
  'man': '男',
  'woman': '女',
};
