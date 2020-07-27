/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2020-07-27 13:52:53
 * @LastEditors: zpl
 */
exports.userGroupList = [{
  name: '管理员',
}, {
  name: '用户',
}];

exports.userList = [{
  loginName: 'admin',
  password: 'waxh1234',
  name: 'admin',
  sex: '男',
  mobile: '18688888888',
  email: '813015173@qq.com',
  remark: '',
  verification_code: '',
  status: 1,
  group: '管理员',
}, {
  loginName: 'user',
  password: 'user',
  name: 'user',
  sex: '男',
  mobile: '',
  email: '',
  remark: '',
  verification_code: '',
  status: 1,
  group: '用户',
}];
