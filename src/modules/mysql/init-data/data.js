/*
 * @description: 数据库初始数据
 * @author: zpl
 * @Date: 2020-07-26 22:19:42
 * @LastEditTime: 2021-03-25 09:19:01
 * @LastEditors: zpl
 */
const { getCurrentDate } = require('../../../util');
const { userStatus, departmentTag } = require('../../../dictionary');

// 部门类别
exports.depTag = [{
  name: 'sqdw',
  descStr: '申请单位',
  orderIndex: 10,
}, {
  name: 'psjg',
  descStr: '评审机构',
  orderIndex: 20,
}, {
  name: 'xmgly',
  descStr: '项目管理员',
  orderIndex: 30,
}, {
  name: 'shy',
  descStr: '审核员',
  orderIndex: 40,
}, {
  name: 'gywyh',
  descStr: '公约委员会',
  orderIndex: 50,
}, {
  name: 'wyhgly',
  descStr: '委员会管理员',
  orderIndex: 60,
}, {
  name: 'pdjdy',
  descStr: '评定决定员',
  orderIndex: 70,
}, {
  name: 'wal',
  descStr: '网安联',
  orderIndex: 80,
}, {
  name: 'admin',
  descStr: '系统管理员',
  orderIndex: 90,
}];

// 部门
exports.departmentList = [{
  name: '管理员',
  tag: departmentTag.系统管理员,
  orderIndex: 0,
}, {
  name: '申请单位',
  tag: departmentTag.申请单位,
  orderIndex: 1,
}, {
  name: '评审机构',
  tag: departmentTag.评审机构,
  orderIndex: 2,
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
  tag: departmentTag.公约委员会,
  orderIndex: 3,
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
  tag: departmentTag.网安联,
  orderIndex: 4,
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
  depTag: departmentTag.系统管理员,
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
  depTag: departmentTag.委员会管理员,
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
  depTag: departmentTag.项目管理员,
  judgingLevel: 3,
}];

// 服务类型
exports.serviceType = [{
  name: '安全咨询',
  descStr: '',
}, {
  name: '安全集成',
  descStr: '',
}, {
  name: '安全运维',
  descStr: '',
}, {
  name: '监测预警',
  descStr: '',
}, {
  name: '应急响应',
  descStr: '',
}, {
  name: '软件安全',
  descStr: '',
}, {
  name: '工业控制系统安全',
  descStr: '',
}, {
  name: '数据安全',
  descStr: '',
}];

// 模块信息
exports.modular = [
  {
    'id': '30883399-21a4-4458-afca-1fdd99ab1194',
    'name': '信息维护',
    'path': '/information',
    'parentId': null,
    'descStr': '申请单位对单位信息的维护功能',
    'orderIndex': 100,
  },
  {
    'id': '1b91761c-7dba-4789-bb80-93f2103c1f12',
    'name': '商务管理',
    'path': '/business',
    'parentId': null,
    'descStr': null,
    'orderIndex': 90,
  },
  {
    'id': '70d5d7fa-15b6-48ee-902f-ad6a455b0d62',
    'name': '证书管理',
    'path': '/certificate/management',
    'parentId': null,
    'descStr': '模板维护',
    'orderIndex': 80,
  },
  {
    'id': '4b6772e7-350b-450c-922b-d477767fcadd',
    'name': '证书管理',
    'path': '/certificate/list',
    'parentId': null,
    'descStr': '管理',
    'orderIndex': 70,
  },
  {
    'id': '9d47c31b-c881-4174-b8d7-fbc00ab217f8',
    'name': '证书管理',
    'path': '/certificate/self',
    'parentId': null,
    'descStr': '申请单位',
    'orderIndex': 60,
  },
  {
    'id': '7c333cb7-85f7-48af-ba8b-464cd10915cb',
    'name': '审核列表',
    'path': '/rating/auditList',
    'parentId': null,
    'descStr': null,
    'orderIndex': 50,
  },
  {
    'id': '7a222cb7-85f7-48af-ba8b-464cd10915ab',
    'name': '申请列表',
    'path': '/rating/applyList',
    'parentId': null,
    'descStr': null,
    'orderIndex': 40,
  },
  {
    'id': 'aa827d4d-a63d-43da-910e-5a20bc8a48f3',
    'name': '填写申请',
    'path': '/submitApplication',
    'parentId': null,
    'descStr': null,
    'orderIndex': 30,
  },
  {
    'id': '353d8908-a3db-4728-b3ae-34a4a92d8c7c',
    'name': '文章管理',
    'path': '/articleManagement',
    'parentId': null,
    'descStr': null,
    'orderIndex': 20,
  },
  {
    'id': '0f659d83-7223-4434-82a2-1b5a1711263c',
    'name': '首页',
    'path': '/home',
    'parentId': null,
    'descStr': null,
    'orderIndex': 10,
  },
  {
    'id': '10f7e298-d527-43f6-a631-3635b0ff8e1e',
    'name': '发票信息维护',
    'path': '/business/invoice',
    'parentId': '1b91761c-7dba-4789-bb80-93f2103c1f12',
    'descStr': null,
    'orderIndex': 40,
  },
  {
    'id': '10f93bdc-7931-423f-a9be-b024c7a62bab',
    'name': '回收站',
    'path': '/articleManagement/recycleBin',
    'parentId': '353d8908-a3db-4728-b3ae-34a4a92d8c7c',
    'descStr': null,
    'orderIndex': 30,
  },
  {
    'id': 'cf8e2146-dc1d-4607-a439-64a10756689e',
    'name': '收款管理',
    'path': '/business/receivePayment',
    'parentId': '1b91761c-7dba-4789-bb80-93f2103c1f12',
    'descStr': null,
    'orderIndex': 30,
  },
  {
    'id': 'b8532ce7-e28d-4126-92b3-56638e1de4eb',
    'name': '付款管理',
    'path': '/business/payment',
    'parentId': '1b91761c-7dba-4789-bb80-93f2103c1f12',
    'descStr': null,
    'orderIndex': 20,
  },
  {
    'id': 'e15da8e1-7861-4e24-8de3-05ff0850feda',
    'name': '文章分组管理',
    'path': '/articleManagement/management',
    'parentId': '353d8908-a3db-4728-b3ae-34a4a92d8c7c',
    'descStr': null,
    'orderIndex': 20,
  },
  {
    'id': '6f9a9004-563f-4bac-ae08-87fb83791a7a',
    'name': '文章列表',
    'path': '/articleManagement/list',
    'parentId': '353d8908-a3db-4728-b3ae-34a4a92d8c7c',
    'descStr': null,
    'orderIndex': 10,
  },
  {
    'id': 'f030147a-5331-434a-b7a5-304c9947f92d',
    'name': '合同管理',
    'path': '/business/contractManagement',
    'parentId': '1b91761c-7dba-4789-bb80-93f2103c1f12',
    'descStr': null,
    'orderIndex': 10,
  },
  {
    'id': 'fbf2cef7-987f-43da-ad3a-e83a1f167083',
    'name': '初次申请',
    'path': '/submitApplication/initialApplication',
    'parentId': 'aa827d4d-a63d-43da-910e-5a20bc8a48f3',
    'descStr': null,
    'orderIndex': null,
  },
];

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
