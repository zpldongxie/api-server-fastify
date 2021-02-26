/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2021-02-25 16:55:48
 * @LastEditors: zpl
 */
const { getCurrentDate } = require('../../../util');
const { userStatus } = require('../../../dictionary');

// 用户组
exports.departmentList = [{
  name: '管理员',
  tag: 'admin',
}, {
  name: '申请单位',
  tag: 'sqdw',
}, {
  name: '评审机构',
  tag: 'psjg',
  // children: [{
  //   name: '西安云适配',
  //   tag: 'xmgly',
  //   children: [{
  //     name: '审核员',
  //     tag: 'shy',
  //   }],
  // }],
}, {
  name: '公约委员会',
  tag: 'gywyh',
  // children: [{
  //   name: '陕西省信息网络安全协会',
  //   tag: 'wyhgly',
  //   children: [{
  //     name: '评定决定员',
  //     tag: 'pdjdy',
  //   }],
  // }],
}, {
  name: '网安联',
  tag: 'wal',
}, {
  name: '访客',
  tag: 'guest',
}];

// 用户
exports.userList = [{
  loginName: 'admin',
  password: 'fwpd@admin',
  mobile: '18688888888',
  email: '285871388@qq.com',
  province: '陕西省',
  verificationCode: '',
  logonDate: getCurrentDate(),
  status: userStatus.enabled,
  group: '管理员',
}, {
  loginName: '陕西省信息网络安全协会',
  companyName: '陕西省信息网络安全协会',
  password: 'Ysp@1234',
  mobile: '18833334444',
  email: '18833334444@qq.com',
  province: '陕西省',
  verificationCode: '',
  logonDate: getCurrentDate(),
  status: userStatus.enabled,
  group: '公约委员会',
}, {
  loginName: '西安云适配网络科技有限公司',
  companyName: '西安云适配网络科技有限公司',
  password: 'Ysp@1234',
  mobile: '18833335555',
  email: '18833335555@qq.com',
  province: '陕西省',
  verificationCode: '',
  logonDate: getCurrentDate(),
  status: userStatus.enabled,
  group: '评审机构',
}];

// 系统配置
exports.sysConfig = [{
  name: 'base_url',
  value: 'http://139.186.165.200:81/',
  descStr: '访问域名/IP',
  group: '上传',
}, {
  name: 'image_ext',
  value: 'gif,jpg,jpeg,png,bmp',
  descStr: '图片格式限制，以英文逗号分隔',
  group: '上传',
}, {
  name: 'image_size',
  value: '1024',
  descStr: '图片大小限制，单位KB',
  group: '上传',
}, {
  name: 'video_ext',
  value: 'mp4,ogg,wav',
  descStr: '视频格式限制，以英文逗号分隔',
  group: '上传',
}, {
  name: 'video_size',
  value: '512000',
  descStr: '视频大小限制，单位KB',
  group: '上传',
}, {
  name: 'audio_ext',
  value: 'mp3',
  descStr: '音频格式限制，以英文逗号分隔',
  group: '上传',
}, {
  name: 'audio_size',
  value: '51200',
  descStr: '音频大小限制，单位KB',
  group: '上传',
}, {
  name: 'other_ext',
  value: 'doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2',
  descStr: '其他格式限制，以英文逗号分隔',
  group: '上传',
}, {
  name: 'other_size',
  value: '5120',
  descStr: '其他大小限制，单位KB',
  group: '上传',
}, {
  name: 'host',
  value: 'smtp.sina.com',
  descStr: 'SMTP服务器',
  group: '邮箱',
}, {
  name: 'port',
  value: '465',
  descStr: '端口号',
  group: '邮箱',
}, {
  name: 'user',
  value: 'zpl_dongxie',
  descStr: '用户名',
  group: '邮箱',
}, {
  name: 'pass',
  value: 'a5a0fbddd5e70460',
  descStr: '授权码',
  group: '邮箱',
}, {
  name: 'from',
  value: '"朱鹏亮" <zpl_dongxie@sina.com>',
  descStr: '发件人邮箱地址',
  group: '邮箱',
}];
