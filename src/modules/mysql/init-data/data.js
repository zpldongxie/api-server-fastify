/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2020-08-18 21:37:58
 * @LastEditors: zpl
 */
exports.userGroupList = [{
  name: '管理员',
  tag: 'admin',
}, {
  name: '用户',
  tag: 'user',
}, {
  name: '访客',
  tag: 'guest',
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
  password: 'Ysp@1234',
  name: 'user',
  sex: '男',
  mobile: '',
  email: '',
  remark: '',
  verification_code: '',
  status: 1,
  group: '用户',
}];

exports.memberTypeList = [{
  name: 'vip会员',
}, {
  name: '普通会员',
}];
