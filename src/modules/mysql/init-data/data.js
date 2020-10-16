/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2020-10-16 15:21:07
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

exports.sysConfig = [{
  name: 'base_url',
  value: 'http://www.snains.cn/upload/',
  descStr: '访问域名/IP',
}, {
  name: 'image_ext',
  value: 'gif,jpg,jpeg,png,bmp',
  descStr: '图片格式限制，以英文逗号分隔',
}, {
  name: 'image_size',
  value: '1024',
  descStr: '图片大小限制，单位KB',
}, {
  name: 'video_ext',
  value: 'mp4,ogg,wav',
  descStr: '视频格式限制，以英文逗号分隔',
}, {
  name: 'video_size',
  value: '512000',
  descStr: '视频大小限制，单位KB',
}, {
  name: 'audio_ext',
  value: 'mp3',
  descStr: '音频格式限制，以英文逗号分隔',
}, {
  name: 'audio_size',
  value: '51200',
  descStr: '音频大小限制，单位KB',
}, {
  name: 'other_ext',
  value: 'doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2',
  descStr: '其他格式限制，以英文逗号分隔',
}, {
  name: 'other_size',
  value: '5120',
  descStr: '其他大小限制，单位KB',
}];
