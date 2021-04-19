/*
 * @description: 教职工基本数据
 * @author: zpl
 * @Date: 2021-04-17 19:24:48
 * @LastEditTime: 2021-04-17 19:41:41
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  GH: { type: DataTypes.STRING(36), allowNull: false, comment: '工号' },
  XM: { type: DataTypes.STRING(60), allowNull: false, comment: '姓名' },
  YWXM: { type: DataTypes.STRING(60), comment: '英文姓名' },
  XMPY: { type: DataTypes.STRING(36), comment: '姓名拼音' },
  CYM: { type: DataTypes.STRING(12), comment: '曾用名' },
  XBM: { type: DataTypes.STRING(1), allowNull: false, comment: '性别码' },
  CSRQ: { type: DataTypes.STRING(8), allowNull: false, comment: '出生日期' },
  CSDM: { type: DataTypes.STRING(64), allowNull: false, comment: '出生地码' },
  JG: { type: DataTypes.STRING(64), comment: '籍贯' },
  MZM: { type: DataTypes.STRING(2), allowNull: false, comment: '民族码' },
  GJDQM: { type: DataTypes.STRING(3), allowNull: false, comment: '国籍/地区码' },
  SFZJLXM: { type: DataTypes.STRING(2), allowNull: false, comment: '身份证件类型码' },
  SFZJH: { type: DataTypes.STRING(20), allowNull: false, comment: '身份证件号' },
  HYZKM: { type: DataTypes.STRING(2), comment: '婚姻状况码' },
  GATQWM: { type: DataTypes.STRING(2), comment: '港澳台侨外码' },
  ZZMMM: { type: DataTypes.STRING(2), allowNull: false, comment: '政治面貌码' },
  JKZKM: { type: DataTypes.STRING(2), comment: '健康状况码' },
  XYZJM: { type: DataTypes.STRING(1), comment: '信仰宗教码' },
  XXM: { type: DataTypes.STRING(1), comment: '血型码' },
  SFZJYXQ: { type: DataTypes.STRING(36), comment: '身份证件有效期' },
  JGH: { type: DataTypes.STRING(18), allowNull: false, comment: '机构号' },
  JTZZ: { type: DataTypes.STRING(128), comment: '家庭住址' },
  XZZ: { type: DataTypes.STRING(128), comment: '现住址' },
  HKSZD: { type: DataTypes.STRING(64), comment: '户口所在地' },
  HKXZM: { type: DataTypes.STRING(1), comment: '户口性质码' },
  XLM: { type: DataTypes.STRING(2), allowNull: false, comment: '学历码' },
  GZNY: { type: DataTypes.STRING(6), allowNull: false, comment: '参加工作年月' },
  LXNY: { type: DataTypes.STRING(6), comment: '来校年月' },
  CJNY: { type: DataTypes.STRING(6), comment: '从教年月' },
  BZLBM: { type: DataTypes.STRING(1), allowNull: false, comment: '编制类别码' },
  DABH: { type: DataTypes.STRING(10), comment: '档案编号' },
  DAWB: { type: DataTypes.STRING(512), comment: '档案文本' },
  TXDZ: { type: DataTypes.STRING(128), allowNull: false, comment: '通信地址' },
  LXDH: { type: DataTypes.STRING(32), allowNull: false, comment: '联系电话' },
  YZBM: { type: DataTypes.STRING(6), comment: '邮政编码' },
  DZXX: { type: DataTypes.STRING(32), comment: '电子信箱' },
  ZYDZ: { type: DataTypes.STRING(32), comment: '主页地址' },
  TC: { type: DataTypes.STRING(255), comment: '特长' },
  GWZYM: { type: DataTypes.STRING(2), allowNull: false, comment: '岗位职业码' },
  ZYRKXD: { type: DataTypes.STRING(1), allowNull: false, comment: '主要任课学段' },
})

export const InfoSchema = S.object()
  .id('JZGJBSJ')
  .description('教职工基本数据')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('GH', S.string().maxLength(36).description('工号').required())
  .prop('XM', S.string().maxLength(60).description('姓名').required())
  .prop('YWXM', S.string().maxLength(60).description('英文姓名'))
  .prop('XMPY', S.string().maxLength(36).description('姓名拼音'))
  .prop('CYM', S.string().maxLength(12).description('曾用名'))
  .prop('XBM', S.string().maxLength(1).description('性别码').required())
  .prop('CSRQ', S.string().maxLength(8).description('出生日期').required())
  .prop('CSDM', S.string().maxLength(64).description('出生地码').required())
  .prop('JG', S.string().maxLength(64).description('籍贯'))
  .prop('MZM', S.string().maxLength(2).description('民族码').required())
  .prop('GJDQM', S.string().maxLength(3).description('国籍 / 地区码').required())
  .prop('SFZJLXM', S.string().maxLength(2).description('身份证件类型码').required())
  .prop('SFZJH', S.string().maxLength(20).description('身份证件号').required())
  .prop('HYZKM', S.string().maxLength(2).description('婚姻状况码'))
  .prop('GATQWM', S.string().maxLength(2).description('港澳台侨外码'))
  .prop('ZZMMM', S.string().maxLength(2).description('政治面貌码').required())
  .prop('JKZKM', S.string().maxLength(2).description('健康状况码'))
  .prop('XYZJM', S.string().maxLength(1).description('信仰宗教码'))
  .prop('XXM', S.string().maxLength(1).description('血型码'))
  .prop('SFZJYXQ', S.string().maxLength(36).description('身份证件有效期'))
  .prop('JGH', S.string().maxLength(18).description('机构号').required())
  .prop('JTZZ', S.string().maxLength(128).description('家庭住址'))
  .prop('XZZ', S.string().maxLength(128).description('现住址'))
  .prop('HKSZD', S.string().maxLength(64).description('户口所在地'))
  .prop('HKXZM', S.string().maxLength(1).description('户口性质码'))
  .prop('XLM', S.string().maxLength(2).description('学历码').required())
  .prop('GZNY', S.string().maxLength(6).description('参加工作年月').required())
  .prop('LXNY', S.string().maxLength(6).description('来校年月'))
  .prop('CJNY', S.string().maxLength(6).description('从教年月'))
  .prop('BZLBM', S.string().maxLength(1).description('编制类别码').required())
  .prop('DABH', S.string().maxLength(10).description('档案编号'))
  .prop('DAWB', S.string().maxLength(512).description('档案文本'))
  .prop('TXDZ', S.string().maxLength(128).description('通信地址').required())
  .prop('LXDH', S.string().maxLength(32).description('联系电话').required())
  .prop('YZBM', S.string().maxLength(6).description('邮政编码'))
  .prop('DZXX', S.string().maxLength(32).description('电子信箱'))
  .prop('ZYDZ', S.string().maxLength(32).description('主页地址'))
  .prop('TC', S.string().maxLength(255).description('特长'))
  .prop('GWZYM', S.string().maxLength(2).description('岗位职业码').required())
  .prop('ZYRKXD', S.string().maxLength(1).description('主要任课学段').required())

export const CreateSchema = S.object()
  .id('CreateJZGJBSJ')
  .description('创建教职工基本数据')
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('GH', S.string().maxLength(36).description('工号').required())
  .prop('XM', S.string().maxLength(60).description('姓名').required())
  .prop('YWXM', S.string().maxLength(60).description('英文姓名'))
  .prop('XMPY', S.string().maxLength(36).description('姓名拼音'))
  .prop('CYM', S.string().maxLength(12).description('曾用名'))
  .prop('XBM', S.string().maxLength(1).description('性别码').required())
  .prop('CSRQ', S.string().maxLength(8).description('出生日期').required())
  .prop('CSDM', S.string().maxLength(64).description('出生地码').required())
  .prop('JG', S.string().maxLength(64).description('籍贯'))
  .prop('MZM', S.string().maxLength(2).description('民族码').required())
  .prop('GJDQM', S.string().maxLength(3).description('国籍 / 地区码').required())
  .prop('SFZJLXM', S.string().maxLength(2).description('身份证件类型码').required())
  .prop('SFZJH', S.string().maxLength(20).description('身份证件号').required())
  .prop('HYZKM', S.string().maxLength(2).description('婚姻状况码'))
  .prop('GATQWM', S.string().maxLength(2).description('港澳台侨外码'))
  .prop('ZZMMM', S.string().maxLength(2).description('政治面貌码').required())
  .prop('JKZKM', S.string().maxLength(2).description('健康状况码'))
  .prop('XYZJM', S.string().maxLength(1).description('信仰宗教码'))
  .prop('XXM', S.string().maxLength(1).description('血型码'))
  .prop('SFZJYXQ', S.string().maxLength(36).description('身份证件有效期'))
  .prop('JGH', S.string().maxLength(18).description('机构号').required())
  .prop('JTZZ', S.string().maxLength(128).description('家庭住址'))
  .prop('XZZ', S.string().maxLength(128).description('现住址'))
  .prop('HKSZD', S.string().maxLength(64).description('户口所在地'))
  .prop('HKXZM', S.string().maxLength(1).description('户口性质码'))
  .prop('XLM', S.string().maxLength(2).description('学历码').required())
  .prop('GZNY', S.string().maxLength(6).description('参加工作年月').required())
  .prop('LXNY', S.string().maxLength(6).description('来校年月'))
  .prop('CJNY', S.string().maxLength(6).description('从教年月'))
  .prop('BZLBM', S.string().maxLength(1).description('编制类别码').required())
  .prop('DABH', S.string().maxLength(10).description('档案编号'))
  .prop('DAWB', S.string().maxLength(512).description('档案文本'))
  .prop('TXDZ', S.string().maxLength(128).description('通信地址').required())
  .prop('LXDH', S.string().maxLength(32).description('联系电话').required())
  .prop('YZBM', S.string().maxLength(6).description('邮政编码'))
  .prop('DZXX', S.string().maxLength(32).description('电子信箱'))
  .prop('ZYDZ', S.string().maxLength(32).description('主页地址'))
  .prop('TC', S.string().maxLength(255).description('特长'))
  .prop('GWZYM', S.string().maxLength(2).description('岗位职业码').required())
  .prop('ZYRKXD', S.string().maxLength(1).description('主要任课学段').required())