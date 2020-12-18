/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2020-12-18 14:26:51
 * @LastEditors: zpl
 */
const { userLevel } = require('../../../dictionary');
exports.userList = [{
  'level': userLevel.admin,
  'num': 'admin',
  'name': '管理员',
  'sex': '男',
}, {
  'level': userLevel.leader,
  'num': 'leader',
  'name': '校领导',
  'sex': '男',
}];
